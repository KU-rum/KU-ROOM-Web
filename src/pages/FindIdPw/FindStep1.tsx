import React, { ChangeEvent } from "react";
import styles from "./FindIdPw.module.css";
import InputBar from "../../components/InputBar/InputBar";
import Button from "../../components/Button/Button";

interface Step1Props {
  verifyCode: string;
  isVerifyAttempted: boolean;
  handleVerifyCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleVerifyCodeTest: () => void;
  resetAll: () => void;
}

const FindStep1: React.FC<Step1Props> = ({
  verifyCode,
  isVerifyAttempted,
  handleVerifyCodeChange,
  handleVerifyCodeTest,
  resetAll,
}) => {
  return (
    <>
      <h1 className={styles.FindStepTitle}>비밀번호 재설정</h1>
      <InputBar
        label="인증코드"
        type="text"
        value={verifyCode}
        placeholder="인증코드를 입력해주세요"
        onChange={handleVerifyCodeChange}
      />
      {isVerifyAttempted && (
        <span className={styles.ErrorMsg}>인증코드를 잘못 입력했습니다.</span>
      )}
      <div style={{ marginTop: "67px" }}>
        <Button
          onClick={handleVerifyCodeTest}
          disabled={verifyCode.length !== 6}
        >
          인증하기
        </Button>
      </div>
      <button className={styles.Retransmit} onClick={resetAll}>
        이메일 재전송
      </button>
    </>
  );
};

export default FindStep1;
