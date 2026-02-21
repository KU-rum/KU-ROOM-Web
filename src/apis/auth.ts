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
  VerifyCodeResponse,
  LoginRequest,
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

// 회원가입 api
// TODO: 제대로 되는지 확인 필요
export const signupApi = async (userData: SignupRequest) => {
  const response = await axiosInstance.post<SignUpResponse>(
    SIGNUP_API_BASE_URL,
    userData,
  );
  return response.data; // 성공 응답 반환
};

// 소셜 로그인 회원가입 api (PreSignupToken 사용)
export const createSocialUserApi = async (
  socialUserData: CreateSocialUserRequest,
) => {
  const response = await axiosInstance.post<LoginResponse>(
    CREATE_SOCIAL_USER_API_URL,
    socialUserData,
  );
  return response.data;
};

// 로그인 api
export const loginApi = async ({ loginId, password }: LoginRequest) => {
  const response = await axiosInstance.post<LoginResponse>(LOGIN_API_URL, {
    loginId,
    password,
  });
  return response.data;
};

// 로그아웃 api
export const logoutApi = async () => {
  const response = await axiosInstance.patch<LogoutResponse>(LOGOUT_API_URL);
  return response.data;
};

// 회원 탈퇴 api
export const withdrawApi = async () => {
  const response =
    await axiosInstance.delete<WithdrawResponse>(WITHDRAW_API_URL);
  return response.data;
};

// 소셜 로그인 api. TempToken으로 실제 AccessToken/RefreshToken 발급받는 api
export const getTokenByTempTokenApi = async (tempToken: string) => {
  const response = await axiosInstance.post<LoginResponse>(
    OAUTH_TOKEN_API_URL,
    null,
    { params: { authCode: tempToken } },
  );
  return response.data;
};

// 아이디 중복확인 api
export const checkIsIdDuplicatedApi = async (value: string) => {
  const response = await axiosInstance.get<CheckIdResponse>(
    VALIDATION_ID_API_URL,
    {
      params: { value },
    },
  );
  return response.data;
};

// 이메일 중복확인 api
export const checkIsEmailDuplicatedApi = async (email: string) => {
  const response = await axiosInstance.post<CheckEmailResponse>(
    VALIDATION_EMAIL_API_URL,
    { email },
  );
  return response.data;
};

// 이메일 전송 요청 api
export const sendEmailApi = async (email: string) => {
  const response = await axiosInstance.post<SendEmailResponse>(
    VERIFY_MAIL_API_URL,
    { email },
  );
  return response.data;
};

// 이메일 인증 코드 검증 api
export const verifyCodeApi = async (verifyData: {
  email: string;
  code: string;
}) => {
  const response = await axiosInstance.post<VerifyCodeResponse>(
    VERIFY_CODE_API_URL,
    verifyData,
  );
  return response.data;
};

// 아이디 찾기 api (이메일 사용)
export const findIdFromEmailApi = async (email: string) => {
  const response = await axiosInstance.get<FindIdResponse>(FIND_ID_API_URL, {
    params: { email },
  });
  return response.data;
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
