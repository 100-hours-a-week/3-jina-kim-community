import { deleteUser, getMyInfo, updateProfile } from "../api/User.js";

document.addEventListener("DOMContentLoaded", async function () {
  const nicknameInput = document.getElementById("nickname");
  const profileImgDiv = document.querySelector(".profileImg");
  const emailText = document.querySelector(".form-group p");

  async function fetchMyInfo() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("로그인이 필요합니다.");
      window.location.href = "../../index.html";
      return;
    }

    try {
      const user = await getMyInfo(userId);
      console.log(user);

      emailText.textContent = user.email;
      nicknameInput.value = user.nickname;

      if (user.profileImageUrl) {
        profileImgDiv.style.backgroundImage = `url(${user.profileImageUrl})`;
        profileImgDiv.textContent = "";
      }
    } catch (err) {
      alert("사용자 정보를 불러올 수 없습니다.");
      console.error(err);
      window.location.href = "../../index.html";
    }
  }

  fetchMyInfo();

  // ✅ 프로필 사진 변경 기능
  profileImgDiv.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profileImgDiv.style.backgroundImage = `url(${e.target.result})`;
          profileImgDiv.textContent = ""; // '+' 제거
          profileImgDiv.dataset.img = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    fileInput.click();
  });

  // ✅ 회원정보 수정 기능
  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const newNickname = nicknameInput.value.trim();
      const helperText = document.querySelector(".helper-text");
      // 기존에 저장된 이미지
      const existingImg = localStorage.getItem("profile_img_url") || "";

      // 새 이미지가 있으면 사용하고, 없으면 기존 이미지 사용
      const profileImg = profileImgDiv.dataset.img || existingImg;

      // 로컬스토리지 갱신
      localStorage.setItem("profile_img_url", profileImg);

      const userId = localStorage.getItem("user_id");

      if (!userId) {
        alert("로그인이 필요합니다.");
        window.location.href = "../../index.html";
        return;
      }

      // 유효성 검사
      if (!newNickname) {
        helperText.textContent = "*닉네임을 입력해주세요.";
        return;
      } else if (newNickname.length > 10) {
        helperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
        return;
      }

      try {
        await updateProfile(userId, newNickname, profileImg);

        showToast("수정완료");

        setTimeout(() => {
          window.location.href = "../pages/PostList.html";
        }, 1000);
      } catch (err) {
        alert("회원정보 수정 실패: " + err.message);
      }
    });

  // ✅ 회원 탈퇴 버튼 클릭 이벤트
  document.querySelector(".quit-button").addEventListener("click", function () {
    openModal(
      "회원탈퇴 하시겠습니까?",
      "작성된 게시글과 댓글은 삭제됩니다.",
      function () {
        deleteUserAccount(); // 회원 탈퇴 함수 실행
      }
    );
  });

  // ✅ 회원 탈퇴 함수 (계정 삭제 처리)
  async function deleteUserAccount() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("로그인이 필요합니다.");
      window.location.href = "../../index.html";
      return;
    }

    try {
      await deleteUser(userId);
      closeModal(); // 모달 닫기
      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "../../index.html"; // 메인 페이지로 이동
    } catch (err) {
      alert("회원탈퇴 실패!" + err.message);
    }
  }
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
}
