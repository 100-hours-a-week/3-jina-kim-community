import { login } from "../src/api/User.js";

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const helperTexts = document.querySelectorAll(".helper-text");
  const loginBtn = document.querySelector(".login-button");

  let isEmailValid = false;
  let isPasswordValid = false;

  function checkValid() {
    loginBtn.disabled = !(isEmailValid && isPasswordValid);
  }

  emailInput.addEventListener("input", function () {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      helperTexts[0].textContent = "*이메일을 입력해주세요.";
      isEmailValid = false;
    } else if (!emailRegex.test(value)) {
      helperTexts[0].textContent =
        "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
      isEmailValid = false;
    } else {
      helperTexts[0].textContent = "";
      isEmailValid = true;
    }
    checkValid();
  });

  passwordInput.addEventListener("input", function () {
    const value = passwordInput.value.trim();

    if (!value) {
      helperTexts[1].textContent = "*비밀번호를 입력해주세요.";
      isPasswordValid = false;
    } else if (
      value.length < 8 ||
      value.length > 20 ||
      !/[A-Z]/.test(value) ||
      !/[a-z]/.test(value) ||
      !/[0-9]/.test(value) ||
      !/[^A-Za-z0-9]/.test(value)
    ) {
      helperTexts[1].textContent =
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
      isPasswordValid = false;
    } else {
      helperTexts[1].textContent = "";
      isPasswordValid = true;
    }
    checkValid();
  });
});

document
  .querySelector("form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await login(email, password);
      localStorage.setItem("user_id", res.id);
      localStorage.setItem("profile_img_url", res.profileImageUrl);
      alert("로그인 성공!");
      window.location.href = "../src/pages/PostList.html";
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  });
