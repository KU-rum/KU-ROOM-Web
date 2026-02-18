// 회원가입 관련 api
import axiosInstance from "./axiosInstance";

const SIGNUP_API_BASE_URL = "/users";
const VALIDATION_ID_API_URL = "/users/check-id?value";
const VALIDATION_EMAIL_API_URL = "/users/validations";
const CHECK_DUPLICATED_NICKNAME_API = "/users/check-nickname?value";

interface SignUpResponse {
  code: number;
  status: string;
  message: string;
  data?: {
    id: number;
  };
}
export const signupApi = async (
  userData: {
    email: string;
    loginId: string;
    password: string;
    studentId: string;
    department: string;
    nickname: string;
    agreementStatus: string;
  },
  setIsDuplicatedNickname: (value: boolean) => void,
  setIsDuplicatedStudentId: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post<SignUpResponse>(
      SIGNUP_API_BASE_URL,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("회원가입 관련 message :", response.data);
    return response.data.message; // 성공 응답 반환
  } catch (error: any) {
    console.error("회원가입 실패:", error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.message || "회원가입 중 오류 발생";

    if (errorMessage === "이미 존재하는 닉네임입니다.") {
      setIsDuplicatedNickname(true);
      setIsDuplicatedStudentId(false);
    } else if (errorMessage === "이미 존재하는 학번입니다.") {
      setIsDuplicatedStudentId(true);
      setIsDuplicatedNickname(false);
    }
    throw new Error(errorMessage);
  }
};

interface CheckIdResponse {
  code: number;
  status: string;
  message: string;
  data: boolean;
}

// 아이디 중복확인
export const checkValidationIdApi = async (newId: string) => {
  try {
    const response = await axiosInstance.get<CheckIdResponse>(
      `${VALIDATION_ID_API_URL}=${newId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
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

interface CheckEmailResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}
// 이메일 중복확인 -> 이부분 중복 검증 잘 되는지 추후 확인 필요
export const checkValidationEmailApi = async (
  email: { email: string },
  setIsDuplicatedEmail: (value: boolean) => void,
  setModalType: (value: string) => void,
  setModalState: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post<CheckEmailResponse>(
      VALIDATION_EMAIL_API_URL,
      email,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.message; // 성공 응답 반환
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

interface CheckNicknameResponse {
  code: number;
  status: string;
  message: string;
  data?: string;
}

export const checkDuplicatedNickname = async (
  newNickname: string,
  setErrorMsg: (value: string) => void,
) => {
  try {
    const response = await axiosInstance.get<CheckNicknameResponse>(
      `${CHECK_DUPLICATED_NICKNAME_API}=${newNickname}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data.data);
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
