const BASE_URL = "http://localhost:8080/posts";

// 댓글 조회
export async function getComments(postId) {
  const response = await fetch(`${BASE_URL}/${postId}/comments`);

  if (!response.ok) {
    throw new Error("댓글 불러오기 실패");
  }

  return await response.json();
}

// 댓글 작성
export async function createComment(postId, userId, content) {
  const response = await fetch(`${BASE_URL}/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ content }),
  });

  return await response.json();
}

// 댓글 수정
export async function updateComment(postId, commentId, userId, content) {
  const response = await fetch(`${BASE_URL}/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ content }),
  });

  return await response.json();
}

// 댓글 삭제
export async function deleteComment(postId, commentId, userId) {
  const response = await fetch(`${BASE_URL}/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "X-USER-ID": userId,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message);
    error.status = response.status; // ✅ 여기 추가!
    throw error;
  }

  return await response.text();
}
