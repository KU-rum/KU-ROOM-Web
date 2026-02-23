import React, { ChangeEvent } from "react";

import InputBar from "@components/InputBar/InputBar";
import Button from "@components/Button/Button";

import styles from "./FindIdPw.module.css";

interface Step2Props {
  userId: string;
  informEmail: string;
  newPw: string;
  allowedPw: boolean;
  checkPw: string;
  errorCode: number | null;
  isCheckedPw: boolean;
  isAttemptReset: boolean;
  handleNewPwChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCheckPwChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleResetPassword: () => void;
}

const FindStep2: React.FC<Step2Props> = ({
  userId,
  newPw,
  allowedPw,
  checkPw,
  errorCode,
  isCheckedPw,
  isAttemptReset,
  handleNewPwChange,
  handleCheckPwChange,
  handleResetPassword,
}) => {
  return (
    <>
      <h1 className={styles.FindStepTitle}>비밀번호 재설정</h1>
      <InputBar
        label="아이디"
        type="text"
        value={userId}
        placeholder="안내 이메일에서 아이디를 확인하세요"
        disabled={true}
      />
      <InputBar
        label="새로운 비밀번호"
        type="password"
        value={newPw}
        placeholder="영문, 숫자, 특수문자 포함 8자 이상"
        onChange={handleNewPwChange}
      />
      {!allowedPw && isAttemptReset && (
        <span className={styles.ErrorMsg}>
          영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.
        </span>
      )}
      {errorCode === 311 && (
        <span className={styles.ErrorMsg}>
          기존 비밀번호로 변경하실 수 없습니다.
        </span>
      )}
      <InputBar
        label="비밀번호 확인"
        type="password"
        value={checkPw}
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        onChange={handleCheckPwChange}
      />
      {!isCheckedPw && isAttemptReset && (
        <span className={styles.ErrorMsg}>비밀번호와 일치하지 않습니다.</span>
      )}
      <div style={{ marginTop: "67px" }}>
        <Button onClick={handleResetPassword} disabled={!newPw || !checkPw}>
          비밀번호 재설정하기
        </Button>
      </div>
    </>
  );
};

export default FindStep2;
