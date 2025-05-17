// 비밀번호 변경 관련 api
import axiosInstance from "./axiosInstance";

const CHANGE_PW_BEFORE_LOGIN_URL = "/users/password-reset/initiate";
const CHANGE_PW_AFTER_LOGIN_URL = "/users/password-reset";

interface ChangePwResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}

// 로그인 전 비밀번호 변경 (아이디/비밀번호 찾기 시 사용)
export const changePwBeforeLogin = async (userInfo: {
  emailRequest: {
    email: string;
    code: string;
  };
  loginId: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.post<ChangePwResponse>(
      CHANGE_PW_BEFORE_LOGIN_URL,
      userInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data; // 성공 응답 반환
  } catch (error: any) {
    console.error("비밀번호 변경 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "비밀번호 변경 중 오류 발생"
    );
  }
};

export const changePwAfterLogin = async (userInfo: {
  prevPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.post<ChangePwResponse>(
      CHANGE_PW_AFTER_LOGIN_URL,
      userInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { code, message, data } = response.data;

    // 서버 응답 코드 기반 처리
    if (code === 310) {
      return { success: false, code, message };
    }
    if (code === 311) {
      return { success: false, code, message };
    }

    return { success: true, data };
  } catch (error: any) {
    const errData = error.response?.data;
    throw { code: errData?.code, message: errData?.message };
  }
};
