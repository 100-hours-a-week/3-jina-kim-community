// ✅ 모달 닫기 함수 (전역에서 사용 가능하도록 미리 정의)
window.closeModal = function () {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
};

// ✅ modal.html을 동적으로 불러와 body에 추가
document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/common/modal/modal.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("모달 HTML을 불러오는 데 실패했습니다.");
      }
      return response.text();
    })
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html); // 모달을 body 끝에 추가
      console.log("✅ 모달이 동적으로 추가됨");

      // ✅ 모달 요소 가져오기
      const modal = document.getElementById("modal");
      const modalText = document.getElementById("modal-text");
      const modalSubText = document.getElementById("modal-subtext");
      const closeButton = document.getElementById("close-button");
      const confirmButton = document.getElementById("confirm-button");

      if (!modal || !modalText || !confirmButton || !closeButton) {
        console.error("❌ 모달 요소를 찾을 수 없습니다. HTML 확인 필요.");
        return;
      }

      // ✅ 닫기 버튼 이벤트 추가
      closeButton.addEventListener("click", closeModal);

      // ✅ 모달 바깥 클릭 시 닫기
      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          closeModal();
        }
      });

      // ✅ 모달 열기 함수 (모달이 추가된 후에 등록해야 함)
      window.openModal = function (content, subContent, action) {
        modalText.textContent = content;
        modalSubText.textContent = subContent;

        confirmButton.addEventListener("click", function () {
          action();
          closeModal();
        });

        modal.style.display = "block";
      };
    })
    .catch((error) => console.error("❌ 모달을 불러오는 중 오류 발생:", error));
});

// ✅ 삭제 기능
function deleteAction() {
  alert("삭제되었습니다.");
}
