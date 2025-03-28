import { getAllPosts } from "../api/Post.js";

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

let allPosts = [];
let currentPage = 0;
const POSTS_PER_LOAD = 10;
let postListContainer;

function renderPosts(startIndex, endIndex) {
  const postsToRender = allPosts.slice(startIndex, endIndex);

  fetch("../components/postList/List.html")
    .then((response) => response.text())
    .then((html) => {
      postsToRender.forEach((post) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = html;
        const listItem = tempElement.querySelector(".listContainer");

        const date = new Date(post.createdAt); // ✅ createdAt 사용
        const formattedDate = `${date.getFullYear()}-${pad(
          date.getMonth() + 1
        )}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
          date.getMinutes()
        )}:${pad(date.getSeconds())}`;

        listItem.querySelector("h2").textContent = post.title;

        listItem.querySelector(
          ".content span:first-child"
        ).textContent = `좋아요 ${formatCount(
          post.likeCount
        )} 댓글 ${formatCount(post.commentCount)} 조회수 ${formatCount(
          post.viewCount
        )}`;

        listItem.querySelector(".content span:last-child").textContent =
          formattedDate;
        listItem.querySelector(".writer").textContent = post.writer;

        const profileImgElement = listItem.querySelector(".profileImg");
        if (post.profileImgUrl) {
          profileImgElement.style.backgroundImage = `url(${post.profileImgUrl})`;
        } else {
          profileImgElement.style.backgroundImage = "none";
        }

        listItem.addEventListener("click", function () {
          window.location.href = `PostDetail.html?id=${post.postId}`;
        });

        postListContainer.appendChild(listItem);
      });
    })
    .catch((error) => console.error("리스트 불러오기 에러:", error));
}

window.addEventListener("scroll", function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMorePosts();
  }
});

function loadMorePosts() {
  const start = currentPage * POSTS_PER_LOAD;
  const end = start + POSTS_PER_LOAD;

  if (start >= allPosts.length) return; // 더 이상 로딩할 게 없으면 종료

  renderPosts(start, end);
  currentPage++;
}

document.addEventListener("DOMContentLoaded", async function () {
  postListContainer = document.getElementById("postListContainer");

  try {
    allPosts = await getAllPosts(); // ✅ 백엔드 API 호출
    console.log(allPosts);
  } catch (error) {
    console.error("게시물 목록을 불러오는 데 실패했습니다:", error);
    postListContainer.innerHTML = "<p>게시글을 불러올 수 없습니다.</p>";
    return;
  }

  if (allPosts.length === 0) {
    postListContainer.innerHTML = "<p>게시글이 없습니다.</p>";
    return;
  }

  loadMorePosts(); // ✅ 처음 게시글 10개 로딩
});
