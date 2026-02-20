import axiosInstance from "./axiosInstance";
import {
  LoginResponse,
  LogoutResponse,
  WithdrawResponse,
  ReissueResponse,
  CreateSocialUserRequest,
  SendEmailResponse,
  SignupRequest,
  SignUpResponse,
  FindIdResponse,
  CheckIdResponse,
  CheckEmailResponse,
  CheckNicknameResponse,
  VerifyCodeResponse,
} from "./types";

const LOGIN_API_URL = "/auth/login";
const LOGOUT_API_URL = "/auth/logout";
const WITHDRAW_API_URL = "/users/deactivate";
const OAUTH_TOKEN_API_URL = "/auth/token";
const REISSUE_TOKEN_API_URL = "/auth/reissue";
const CREATE_SOCIAL_USER_API_URL = "/users/social";
const SIGNUP_API_BASE_URL = "/users";
const VERIFY_MAIL_API_URL = "/mails/auth-codes";
const VERIFY_CODE_API_URL = "/mails/verification_codes";
const FIND_ID_API_URL = "/users/loginId";
const VALIDATION_ID_API_URL = "/users/check-id";
const VALIDATION_EMAIL_API_URL = "/users/validations";
const CHECK_DUPLICATED_NICKNAME_API = "/users/check-nickname";

// 회원가입 api
export const signupApi = async (userData: SignupRequest) => {
  const response = await axiosInstance.post<SignUpResponse>(
    SIGNUP_API_BASE_URL,
    userData,
  );
  return response.data; // 성공 응답 반환
};

// 로그인 api
export const loginApi = async (loginId: string, password: string) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(LOGIN_API_URL, {
      loginId,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return error.response.data;
    }
    throw new Error(error.response?.data?.message || "로그인 중 오류 발생");
  }
};

// 로그아웃 api
export const logoutApi = async () => {
  try {
    const response = await axiosInstance.patch<LogoutResponse>(LOGOUT_API_URL);

    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return error.response.data;
    }
    throw new Error(error.response?.data?.message || "로그아웃 중 오류 발생");
  }
};

// 회원 탈퇴 api
export const withdrawApi = async () => {
  try {
    const response =
      await axiosInstance.delete<WithdrawResponse>(WITHDRAW_API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "회원탈퇴 중 오류 발생");
  }
};

// TempToken으로 실제 AccessToken/RefreshToken 발급받는 api
export const getTokenByTempTokenApi = async (tempToken: string) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      OAUTH_TOKEN_API_URL,
      null,
      { params: { authCode: tempToken } },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "토큰 발급 중 오류 발생");
  }
};

// 토큰 재발급 api
export const reissueTokenApi = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await axiosInstance.patch<ReissueResponse>(
      REISSUE_TOKEN_API_URL,
      {
        refreshToken,
      },
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "토큰 재발급 중 오류 발생",
    );
  }
};

// 소셜 로그인 신규 회원 생성 API (PreSignupToken 사용)
// TODO: 제대로 되는지 확인 필요
export const createSocialUserApi = async (
  socialUserData: CreateSocialUserRequest,
  setIsDuplicatedNickname: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      CREATE_SOCIAL_USER_API_URL,
      socialUserData,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "회원가입 중 오류 발생";
    if (errorMessage === "이미 존재하는 닉네임입니다.") {
      setIsDuplicatedNickname(true);
    }
    throw new Error(
      error.response?.data?.message || "소셜 로그인 회원 생성 중 오류 발생",
    );
  }
};

// 이메일 전송 요청 api
export const sendEmailApi = async (email: string) => {
  try {
    const response = await axiosInstance.post<SendEmailResponse>(
      VERIFY_MAIL_API_URL,
      { email },
    );
    return response.data;
  } catch (error: any) {
    console.error("이메일 전송 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "이메일 전송 중 오류 발생",
    );
  }
};

// 이메일 인증 코드 검증 api
export const verifyCodeApi = async (verifyData: {
  email: string;
  code: string;
}) => {
  try {
    const response = await axiosInstance.post<VerifyCodeResponse>(
      VERIFY_CODE_API_URL,
      verifyData,
    );
    console.log(response.data);
    return response.data.data.verified;
  } catch (error: any) {
    console.error("인증코드 검증 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "인증코드 검증 중 오류 발생",
    );
  }
};

// 아이디 찾기 api (이메일 사용)
export const findIdFromEmailApi = async (email: string) => {
  try {
    const response = await axiosInstance.get<FindIdResponse>(FIND_ID_API_URL, {
      params: { email },
    });
    return response.data.data?.loginId;
  } catch (error: any) {
    console.error("아이디 조회 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "아이디 조회 중 오류 발생",
    );
  }
};

// 아이디 중복확인 api
export const checkValidationIdApi = async (value: string) => {
  try {
    const response = await axiosInstance.get<CheckIdResponse>(
      VALIDATION_ID_API_URL,
      {
        params: { value },
      },
    );
    console.log(response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("아이디 확인 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "아이디 확인 중 오류 발생",
    );
  }
};

// 이메일 중복확인 api
export const checkValidationEmailApi = async (
  email: string,
  setIsDuplicatedEmail: (value: boolean) => void,
  setModalType: (value: string) => void,
  setModalState: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post<CheckEmailResponse>(
      VALIDATION_EMAIL_API_URL,
      { email },
    );
    return response.data.message;
  } catch (error: any) {
    console.error("이메일 확인 실패:", error.response?.data || error.message);
    if (error.response.data.code === 305) {
      setIsDuplicatedEmail(true);
    } else if (error.response.data.code === 900) {
      setModalType("EmailFailed");
      setModalState(true);
    }
    throw new Error(
      error.response?.data?.message || "이메일 확인 중 오류 발생",
    );
  }
};

// 닉네임 중복 확인 api
export const checkDuplicatedNicknameApi = async (
  value: string,
  setErrorMsg: (value: string) => void,
) => {
  try {
    const response = await axiosInstance.get<CheckNicknameResponse>(
      CHECK_DUPLICATED_NICKNAME_API,
      {
        params: { value },
      },
    );
    return response.data.message;
  } catch (error: any) {
    console.error("닉네임 확인 실패:", error.response?.data || error.message);
    const errorMessage =
      error.response?.data?.message || "닉네임 확인 중 오류 발생";
    setErrorMsg(errorMessage);
    throw new Error(
      error.response?.data?.message || "닉네임 확인 중 오류 발생",
    );
  }
};
