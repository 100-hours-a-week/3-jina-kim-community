import { updatePassword } from "../api/User.js";

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("passwordConfirm");
  const helperTexts = document.querySelectorAll(".helper-text");
  const loginBtn = document.querySelector(".login-button");

  let isPasswordValid = false;
  let isPasswordConfirmValid = false;

  function checkValid() {
    loginBtn.disabled = !(isPasswordValid && isPasswordConfirmValid);
  }

  passwordInput.addEventListener("input", function () {
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    if (!password) {
      helperTexts[0].textContent = "*비밀번호를 입력해주세요.";
      isPasswordValid = false;
      return;
    } else if (
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      helperTexts[0].textContent =
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
      isPasswordValid = false;
      return;
    } else {
      helperTexts[0].textContent = "";
      isPasswordValid = true;
    }
    checkValid();
  });

  passwordConfirmInput.addEventListener("input", function () {
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    if (!passwordConfirm) {
      helperTexts[1].textContent = "*비밀번호를 한번 더 입력해주세요.";
      isPasswordConfirmValid = false;
      return;
    }
    if (password !== passwordConfirm) {
      helperTexts[1].textContent = "*비밀번호와 다릅니다.";
      isPasswordConfirmValid = false;
      return;
    } else {
      helperTexts[1].textContent = "";
      isPasswordConfirmValid = true;
    }
    checkValid();
  });
});

document
  .querySelector("form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPassword = document.getElementById("password").value.trim();
    const userId = localStorage.getItem("user_id");

    try {
      await updatePassword(userId, newPassword);

      showToast("수정완료");

      setTimeout(() => {
        window.location.href = "../pages/PostList.html";
      }, 1000);
    } catch (err) {
      alert("회원정보 수정 실패: " + err.message);
    }
  });

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
}
