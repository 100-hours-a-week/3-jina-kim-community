const BASE_URL = "http://localhost:8080/likes";

// 좋아요 토글
export async function toggleLike(userId, postId) {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ postId }),
  });

  return await response.json();
}
