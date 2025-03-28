import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../api/Comment.js";
import { deletePost, getPost } from "../api/Post.js";
import { toggleLike } from "../api/PostLike.js";

function formatCount(num) {
  if (num >= 100000) return "100k";
  if (num >= 10000) return "10k";
  if (num >= 1000) return "1k";
  return num;
}

// 도우미 함수
function pad(n) {
  return n.toString().padStart(2, "0");
}

function formattedDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

let post;

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const deletePostButton = document.getElementById("deletePost");
  const userId = localStorage.getItem("user_id");

  if (!postId) {
    document.body.innerHTML = "<p>잘못된 접근입니다.</p>";
    return;
  }

  try {
    post = await getPost(userId, postId);
    console.log(post);
  } catch (error) {
    console.error("게시물을 불러오지 못했습니다:", error);
    return;
  }

  // ✅ 게시글 정보 채우기
  document.getElementById("postTitle").textContent = post.title;
  document.getElementById("postContent").textContent = post.content;
  document.getElementById("postDate").textContent = `작성일: ${formattedDate(
    new Date(post.created_at)
  ).toLocaleString()}`;

  document.getElementById("postWriter").textContent = post.user_name;

  const profileImgElement = document.querySelector(".profileImg");
  if (post.user_img_url) {
    profileImgElement.style.backgroundImage = `url(${post.user_img_url})`;
  } else {
    profileImgElement.style.backgroundImage = "none"; // 기본 이미지
  }

  const postImg = document.getElementById("postImg");
  if (post.post_img_url) {
    postImg.src = post.post_img_url; // Base64 이미지 적용
    postImg.style.display = "block"; // 이미지가 있으면 표시
  } else {
    postImg.style.display = "none"; // 이미지가 없으면 숨기기
  }

  // ✅ 게시글 수정 기능 (간단한 예제, 실제 수정 폼 필요)
  document.getElementById("editPost").addEventListener("click", function () {
    window.location.href = `WritePost.html?editId=${postId}`;
  });
  // ✅ 댓글 불러오기
  loadComments();

  if (deletePostButton) {
    deletePostButton.addEventListener("click", function () {
      deleteAction(postId);
    });
  }

  function deleteAction(postId) {
    openModal(
      "게시글을 삭제하시겠습니까?",
      "삭제한 내용은 복구 할 수 없습니다.",
      function () {
        deletePostConfirmed(postId);
      }
    );
  }

  // ✅ 게시글 삭제 함수 (모달에서 "확인" 누르면 실행)
  async function deletePostConfirmed(postId) {
    try {
      await deletePost(userId, postId);
      closeModal(); // 모달 닫기
      window.location.href = "PostList.html"; // 리스트 페이지로 이동
    } catch (err) {
      if (err.status === 403) {
        alert("작성자 본인만 삭제할 수 있습니다.");
      } else {
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  }

  // ✅ 좋아요 기능
  const likeButton = document.getElementById("likeButton");

  // UI 업데이트 함수
  function updateLikeUI(isLiked, likeCount) {
    likeButton.classList.toggle("active", isLiked);
    likeButton.innerHTML = `${formatCount(likeCount)}<br />좋아요수`;
  }

  // 최초 1회 UI 반영
  updateLikeUI(post.liked, post.likeCount);

  // 클릭 시 토글
  likeButton.addEventListener("click", async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const result = await toggleLike(userId, postId);
      console.log(result);
      updateLikeUI(result.liked, result.likeCount);
    } catch (error) {
      console.error("좋아요 토글 실패", error);
    }
  });

  const viewElement = document.getElementById("viewCount");
  viewElement.innerHTML = `${formatCount(post.viewCount)}<br />조회수`;

  const commentInput = document.getElementById("commentInput");
  const submitButton = document.getElementById("submitComment");
  let commentEditMode = false;
  let editingCommentId = null;

  // 페이지 로드 시 초기 상태 확인
  submitButton.disabled = commentInput.value.trim() === "";

  // ✅ 입력할 때마다 버튼 활성화/비활성화
  commentInput.addEventListener("input", function () {
    const text = commentInput.value.trim();
    submitButton.disabled = text === "";
  });

  // ✅ 댓글 등록 기능
  document
    .getElementById("submitComment")
    .addEventListener("click", async function () {
      const commentInput = document.getElementById("commentInput");
      const commentText = commentInput.value.trim();

      if (commentEditMode && editingCommentId !== null) {
        try {
          await updateComment(postId, editingCommentId, userId, commentText);
          commentInput.value = "";
          commentEditMode = false;
          editingCommentId = null;
          submitButton.textContent = "댓글 등록";
        } catch (err) {
          console.log(err);
          alert("댓글 수정 실패");
        }
      } else {
        try {
          await createComment(postId, userId, commentText);
        } catch (error) {
          console.error("댓글 등록 실패:", error);
          alert("댓글 등록 중 오류가 발생했습니다.");
        }
      }
      commentInput.value = "";
      submitButton.disabled = true;
      loadComments();
    });

  let comments;
  async function loadComments() {
    const commentListContainer = document.getElementById(
      "commentListContainer"
    );
    const commentCountElement = document.getElementById("commentCount");
    commentListContainer.innerHTML = "";

    try {
      comments = await getComments(postId);
      console.log(comments);
    } catch (err) {
      console.log(err);
      alert("댓글을 불러올 수 없습니다.");
    }

    commentCountElement.innerHTML = `${formatCount(comments.length)}<br />댓글`;

    if (post.commentCount === 0) {
      commentListContainer.innerHTML = "<p>댓글이 없습니다.</p>";
      return;
    }

    fetch("../components/postDetail/CommentList.html")
      .then((response) => response.text())
      .then((html) => {
        comments.forEach((comment) => {
          const tempElement = document.createElement("div");
          tempElement.innerHTML = html;

          // `commentListContainer` 내부 요소 찾기
          const commentElement = tempElement.querySelector(
            ".commentListContainer"
          );

          // ✅ 값 변경
          commentElement.querySelector(".writer").textContent =
            comment.user_nickname;
          commentElement.querySelector(".date").textContent = formattedDate(
            new Date(comment.created_at)
          );
          commentElement.querySelector(".commentContent").textContent =
            comment.content;

          // ✅ 프로필 이미지 설정
          const profileImgElement = commentElement.querySelector(".profileImg");
          if (comment.user_img) {
            profileImgElement.style.backgroundImage = `url(${comment.user_img})`;
          } else {
            profileImgElement.style.backgroundImage = "none"; // 기본 이미지
          }

          // ✅ 수정 버튼 기능 추가
          commentElement
            .querySelector(".editButton:nth-child(1)")
            .addEventListener("click", function () {
              commentInput.value = comment.content;
              submitButton.disabled = false;

              // 수정 모드로 전환
              commentEditMode = true;
              editingCommentId = comment.comment_id;
              submitButton.textContent = "댓글 수정";
            });

          const deleteButton = commentElement.querySelector(
            ".editButton:nth-child(2)"
          );
          deleteButton.addEventListener("click", function () {
            deleteCommentAction(comment.comment_id);
          });

          commentListContainer.appendChild(commentElement);
        });
      })
      .catch((error) => console.error("댓글 리스트 불러오기 에러:", error));
  }

  function deleteCommentAction(commentId) {
    openModal(
      "댓글을 삭제하시겠습니까?",
      "삭제한 내용은 복구 할 수 없습니다.",
      function () {
        deleteCommentConfirmed(commentId);
      }
    );
  }

  async function deleteCommentConfirmed(commentId) {
    try {
      await deleteComment(postId, commentId, userId);

      closeModal();
      loadComments();
    } catch (err) {
      if (err.status === 403) {
        alert("작성자 본인만 삭제할 수 있습니다.");
      } else {
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  }
});
