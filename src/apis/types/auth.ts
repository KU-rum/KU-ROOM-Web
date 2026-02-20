import { ApiResponse } from ".";

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse extends ApiResponse {
  data?: {
    tokenResponse: {
      accessToken: string;
      refreshToken: string;
      accessExpireIn: number;
      refreshExpireIn: number;
      isFirstLogin?: boolean;
    };
    userResponse: {
      id: number;
      oauthId: string | null;
      loginId: string;
      email: string;
      nickname: string;
      studentId: string;
      imageUrl: string | null;
      departmentResponse: {
        departmentId: number;
        departmentName: string;
      }[];
    };
  };
}

export interface LogoutResponse extends ApiResponse {
  data?: string;
}

export interface WithdrawResponse extends ApiResponse {
  data: string;
}

export interface ReissueResponse extends ApiResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    accessExpireIn: number;
    refreshExpireIn: number;
  };
}

export interface CreateSocialUserRequest {
  token: string;
  studentId: string;
  department: string;
  nickname: string;
  agreementStatus: string;
}

export interface SendEmailResponse extends ApiResponse {
  data: string;
}

export interface VerifyCodeResponse extends ApiResponse {
  data: {
    verified: boolean;
  };
}

export interface SignupRequest {
  email: string;
  loginId: string;
  password: string;
  studentId: string;
  department: string;
  nickname: string;
  agreementStatus: string;
}

export interface SignUpResponse extends ApiResponse {
  data?: {
    id: number;
  };
}

export interface FindIdResponse extends ApiResponse {
  data?: {
    loginId: string;
  };
}

export interface CheckIdResponse extends ApiResponse {
  data?: string;
}

export interface CheckEmailResponse extends ApiResponse {
  data?: string;
}

export interface CheckNicknameResponse extends ApiResponse {
  data?: string;
}
