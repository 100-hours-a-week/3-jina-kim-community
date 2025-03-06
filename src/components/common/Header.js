document.addEventListener("DOMContentLoaded", function () {
  fetch("../components/common/Header.html") // 헤더 파일 불러오기
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);

      // ✅ 특정 페이지에서만 뒤로가기 버튼 추가
      const backButton = document.getElementById("back-button");
      const mypageButtonContainer = document.getElementById("mypage-button");
      const currentPage = window.location.pathname; // 현재 페이지 경로 가져오기

      // ✅ 뒤로가기 버튼 (PostDetail.html, WritePost.html에서만 보이게)
      if (
        currentPage.includes("PostDetail.html") ||
        currentPage.includes("WritePost.html")
      ) {
        backButton.innerHTML = `<p onclick="history.back()">‹</p>`;
      }

      // ✅ 마이페이지 버튼 추가 (PostList.html에서만)
      if (
        currentPage.includes("PostList.html") ||
        currentPage.includes("EditInfo.html") ||
        currentPage.includes("EditPassword.html") ||
        currentPage.includes("PostDetail.html") ||
        currentPage.includes("WritePost.html")
      ) {
        // ✅ 현재 로그인한 사용자 정보 가져오기
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (currentUser && currentUser.profileImg) {
          // ✅ 프로필 사진을 버튼으로 사용
          mypageButtonContainer.innerHTML = `
            <div id="profile-button" class="profile-pic"></div>
            <div id="mypage-dropdown" class="dropdown-menu">
              <a href="EditInfo.html">회원정보수정</a>
              <a href="EditPassword.html">비밀번호수정</a>
              <a href="#" id="logout">로그아웃</a>
            </div>
          `;
          document.getElementById(
            "profile-button"
          ).style.backgroundImage = `url(${currentUser.profileImg})`;
        } else {
          // 기본 프로필 이미지 (로그인한 사용자에게 프로필 이미지가 없을 경우)
          mypageButtonContainer.innerHTML = `
            <div id="profile-button" class="profile-pic default"></div>
            <div id="mypage-dropdown" class="dropdown-menu">
              <a href="EditInfo.html">회원정보수정</a>
              <a href="EditPassword.html">비밀번호수정</a>
              <a href="#" id="logout">로그아웃</a>
            </div>
          `;
        }

        // ✅ 드롭다운 기능 추가
        const profileButton = document.getElementById("profile-button");
        const dropdownMenu = document.getElementById("mypage-dropdown");

        if (profileButton && dropdownMenu) {
          // 버튼 클릭 시 드롭다운 토글
          profileButton.addEventListener("click", function (event) {
            event.stopPropagation(); // 이벤트 전파 방지
            dropdownMenu.classList.toggle("show");
          });

          // 페이지의 다른 곳을 클릭하면 드롭다운 닫기
          document.body.addEventListener("click", function () {
            dropdownMenu.classList.remove("show");
          });

          // 드롭다운 내부 클릭 시 닫히지 않도록 방지
          dropdownMenu.addEventListener("click", function (event) {
            event.stopPropagation();
          });
        }

        // ✅ 로그아웃 기능 추가
        document
          .getElementById("logout")
          .addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            alert("로그아웃되었습니다.");
            window.location.href = "../../index.html";
          });
      }
    })
    .catch((error) => console.error("Header 로드 오류:", error));
});
