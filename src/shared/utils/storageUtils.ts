// 인증 관련 localStorage 항목만 선택적으로 삭제
export const clearAuthStorage = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user-storage");
};
