const BASE_URL = "http://localhost:8080/posts";

// 게시물 목록 조회
export async function getAllPosts() {
  const response = await fetch(`${BASE_URL}`);

  if (!response.ok) {
    throw new Error("게시물 리스트 불러오기 실패");
  }

  return await response.json();
}

// 게시물 상세 조회
export async function getPost(userId, postId) {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    headers: {
      "X-USER-ID": userId,
    },
  });

  if (!response.ok) {
    throw new Error("게시물 불러오기 실패");
  }

  return await response.json();
}

// 게시물 작성
export async function createPost(
  userId,
  title,
  content,
  postImgUrl,
  imageName
) {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ title, content, postImgUrl, imageName }),
  });

  return await response.json();
}

// 게시물 수정
export async function updatePost(
  userId,
  postId,
  title,
  content,
  postImgUrl,
  imageName
) {
  const response = await fetch(`${BASE_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ title, content, postImgUrl, imageName }),
  });

  return await response.json();
}

// 게시물 삭제
export async function deletePost(userId, postId) {
  const response = await fetch(`${BASE_URL}/${postId}`, {
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
