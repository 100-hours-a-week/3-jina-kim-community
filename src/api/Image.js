// src/api/Image.js

const IMAGE_API_URL = "http://localhost:8080/api/images/upload";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(IMAGE_API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("이미지 업로드 실패");
  const { imageUrl } = await response.json(); // 백엔드에서 imageUrl 넘겨줌
  return imageUrl;
}
