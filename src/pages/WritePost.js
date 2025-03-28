import { uploadImage } from "../api/Image.js";
import { createPost, getPost, updatePost } from "../api/Post.js";

document.addEventListener("DOMContentLoaded", async function () {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const submitButton = document.getElementById("submitButton");

  titleInput.addEventListener("input", function () {
    if (titleInput.value.length > 26) {
      titleInput.value = titleInput.value.slice(0, 26);
    }
    checkFormValidity();
  });

  contentInput.addEventListener("input", checkFormValidity);

  function checkFormValidity() {
    const isTitleFilled = titleInput.value.trim().length > 0;
    const isContentFilled = contentInput.value.trim().length > 0;
    submitButton.disabled = !(isTitleFilled && isContentFilled);
  }

  // 수정 모드에서 기존 값 채워졌을 때 버튼 활성화
  checkFormValidity();

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("editId");
  const userId = localStorage.getItem("user_id");

  const fileInput = document.createElement("input"); // 파일 업로드 input (hidden)
  fileInput.type = "file";
  fileInput.accept = "image/*"; // 이미지 파일만 허용
  let imageBase64 = ""; // 이미지 Base64 데이터 저장 변수
  let imageName = "";

  // ✅ "파일 선택" 버튼 클릭 시 파일 업로드 창 열기
  document.querySelector(".imgfile").addEventListener("click", function (e) {
    e.preventDefault();
    fileInput.click();
  });

  // ✅ 파일 선택 시 Base64로 변환하여 저장
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imageBase64 = event.target.result; // Base64 데이터 저장
        imageName = file.name;
        document.querySelector(".ment").textContent = imageName; // 선택된 파일명 표시
      };
      reader.readAsDataURL(file);
    }
  });

  if (editId) {
    try {
      const post = await getPost(userId, editId);

      titleInput.value = post.title;
      contentInput.value = post.content;
      imageBase64 = post.post_img_url || "";
      imageName = post.post_img_name || "";
      document.querySelector(".ment").textContent = imageName || "";
      document.getElementById("editId").value = editId;
      submitButton.textContent = "수정하기";

      checkFormValidity(); // 버튼 활성화
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      alert("게시글 정보를 불러오지 못했습니다.");
    }
  }

  // ✅ 게시글 저장 또는 수정
  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const title = document.getElementById("title").value.trim();
      const content = document.getElementById("content").value.trim();
      const editId = document.getElementById("editId").value; // 수정 ID
      const userId = localStorage.getItem("user_id");

      if (!title || !content) {
        alert("제목과 내용을 입력해주세요!");
        return;
      }

      if (editId) {
        try {
          let postImgUrl = imageBase64; // 기본값: 기존 이미지 URL 유지
          const file = fileInput.files[0];

          if (file) {
            postImgUrl = await uploadImage(file); // 새 이미지 업로드
            imageName = file.name;
          }

          const res = await updatePost(
            userId,
            editId,
            title,
            content,
            postImgUrl,
            imageName // ✅ 수정 요청에 이미지 이름도 포함
          );

          alert("게시글이 수정되었습니다.");
          window.location.href = `PostDetail.html?id=${editId}`;
        } catch (error) {
          console.error("게시글 수정 실패:", error);
          alert("게시글 수정 중 오류가 발생했습니다.");
        }
      } else {
        try {
          let postImgUrl = "";

          const file = fileInput.files[0];
          if (file) {
            postImgUrl = await uploadImage(file); // ✅ 이미지 업로드해서 URL 받기
            imageName = file.name;
          }

          const res = await createPost(
            userId,
            title,
            content,
            postImgUrl,
            imageName
          ); // ✅ imageBase64 ❌ imageUrl ✅
          console.log(res);
          window.location.href = "PostList.html";
        } catch (error) {
          console.error("게시글 등록 실패:", error);
          alert("게시글 등록 중 오류가 발생했습니다.");
        }
        // image: imageBase64, // Base64 이미지 추가
        // imageName,
      }
    });
});
