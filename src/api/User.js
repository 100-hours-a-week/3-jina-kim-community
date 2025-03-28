const BASE_URL = "http://localhost:8080/users";

// 회원가입
export async function register(email, password, nickname, profileImageUrl) {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nickname, profileImageUrl }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg);
  }
  return await response.json();
}

// 로그인
export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg);
  }

  return await response.json(); // id, nickname, profileImageUrl 등
}

// 내 정보 조회
export async function getMyInfo(userId) {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: {
      "X-USER-ID": userId,
    },
  });

  return await response.json();
}

// 회원정보 수정
export async function updateProfile(userId, newNickname, newProfileImageUrl) {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ newNickname, newProfileImageUrl }),
  });

  return await response.json();
}

// 비밀번호 변경
export async function updatePassword(userId, newPassword) {
  const response = await fetch(`${BASE_URL}/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId,
    },
    body: JSON.stringify({ newPassword }),
  });

  return await response.json();
}

// 회원탈퇴
export async function deleteUser(userId) {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "DELETE",
    headers: {
      "X-USER-ID": userId,
    },
  });

  return await response.text();
}
