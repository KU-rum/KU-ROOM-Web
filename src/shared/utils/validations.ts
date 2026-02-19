// 형식에 맞는지 확인하는 함수들

import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { checkValidationIdApi } from "@apis/auth";

// 이메일 형식이 맞는지
export const isValidEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

// 비밀번호 형식이 맞는지
export const isValidPassword = (password: string) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// 학번 형식이 맞는지
export const isValidStudentId = (id: string) => {
  // 학번이 8자리 이상이고, 앞 4자리(연도)가 현재 연도보다 크지 않은지 확인
  if (id.length >= 9) {
    const yearPrefix = parseInt(id.substring(0, 4));
    const currentYear = new Date().getFullYear();
    return yearPrefix <= currentYear && id.length < 10;
  }
  return true; // 아직 8자리가 안되면 유효하다고 처리 (경고 표시 안함)
};

// 아이디 중복 여부 검사
export const checkAvailableId = async (
  signupId: string,
  setIsAvailableId: Dispatch<SetStateAction<boolean | null>>,
  setIsChecked: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    await checkValidationIdApi(signupId);
    setIsAvailableId(true);
  } catch (error) {
    setIsAvailableId(false);
    console.error(error);
  } finally {
    setIsChecked(true); // 무조건 실행되도록!
  }
};

// 비밀번호 설정 검증
export const handleSettingPassword = (
  signupId: string,
  inputPw: string,
  checkPw: string,
  setIsAttemptReset: Dispatch<SetStateAction<boolean>>,
  setAllowedPw: Dispatch<SetStateAction<boolean>>,
  setIsCheckedPw: Dispatch<SetStateAction<boolean>>,
  navigate: NavigateFunction,
) => {
  setIsAttemptReset(true);
  const isPwValid = isValidPassword(inputPw);
  const isPwMatch = checkPw === inputPw;
  setAllowedPw(isPwValid);
  setIsCheckedPw(isPwMatch);

  if (isPwValid && isPwMatch) {
    console.log("설정 성공!");
    navigate("/identityverifictaion", {
      state: { signupId: signupId, signupPw: inputPw },
    });
  } else {
    console.log("설정 실패: 조건을 다시 확인하세요.");
  }
};
