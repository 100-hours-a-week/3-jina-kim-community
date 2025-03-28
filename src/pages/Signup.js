import { uploadImage } from "../api/Image.js";
import { register } from "../api/User.js";

let selectedProfileFile = null;

document.addEventListener("DOMContentLoaded", function () {
  const profileImgDiv = document.querySelector(".profileImg");
  const helperTexts = document.querySelectorAll(".helper-text");
  const signupBtn = document.querySelector(".login-button");

  profileImgDiv.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        selectedProfileFile = file; // ✅ 여기 추가
        const reader = new FileReader();
        reader.onload = function (e) {
          profileImgDiv.style.backgroundImage = `url(${e.target.result})`;
          profileImgDiv.textContent = "";
          helperTexts[0].textContent = "";
        };
        reader.readAsDataURL(file);
      }
    });

    fileInput.click(); //파일을 가짜로 클릭
  });

  const inputs = [
    document.querySelector(".profileImg"),
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("passwordConfirm"),
    document.getElementById("nickname"),
  ];

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const validStates = [true, false, false, false, false];

  function checkAllValid() {
    const allValid = validStates.every((state) => state === true);
    signupBtn.disabled = !allValid;
  }

  inputs.forEach((input, index) => {
    input.addEventListener("blur", function () {
      const value = input.value.trim();
      let message = "";
      let isValid = false;

      if (index === 1) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          message = "*이메일을 입력해주세요.";
        } else if (!emailRegex.test(value)) {
          message =
            "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
        } else if (users.some((user) => user.email === value)) {
          message = "*중복된 이메일입니다.";
        } else {
          isValid = true;
        }
      } else if (index === 2) {
        if (!value) {
          message = "*비밀번호를 입력해주세요.";
        } else if (
          value.length < 8 ||
          value.length > 20 ||
          !/[A-Z]/.test(value) || // 대문자
          !/[a-z]/.test(value) || // 소문자
          !/[0-9]/.test(value) || // 숫자
          !/[^A-Za-z0-9]/.test(value) // 특수문자
        ) {
          message =
            "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        } else {
          isValid = true;
        }
      } else if (index === 3) {
        if (!value) {
          message = "*비밀번호를 한번 더 입력해주세요.";
        } else if (value !== inputs[2].value.trim()) {
          message = "*비밀번호가 다릅니다.";
        } else {
          isValid = true;
        }
      } else if (index === 4) {
        if (!value) {
          message = "*닉네임을 입력해주세요.";
        } else if (value.includes(" ")) {
          message = "*띄어쓰기를 없애주세요.";
        } else if (users.some((user) => user.nickname === value)) {
          message = "*중복된 닉네임입니다.";
        } else if (value.length > 10) {
          message = "*닉네임은 최대 10자까지 작성 가능합니다.";
        } else {
          isValid = true;
        }
      }

      validStates[index] = isValid;
      helperTexts[index].textContent = message;
      checkAllValid();
    });
  });
});

document
  .querySelector("form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const nickname = document.getElementById("nickname").value.trim();

    try {
      let profileImgUrl = "";
      if (selectedProfileFile) {
        profileImgUrl = await uploadImage(selectedProfileFile); // ✅ 이미지 먼저 업로드
      }

      const res = await register(email, password, nickname, profileImgUrl);
      console.log(res);
      alert("회원가입 성공!");
      window.location.href = "../../index.html";
    } catch (err) {
      alert("회원가입 실패: " + err.message);
    }
  });
