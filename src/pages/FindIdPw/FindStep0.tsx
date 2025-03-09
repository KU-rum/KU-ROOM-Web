import React, { ChangeEvent } from "react";
import styles from "./FindIdPw.module.css";
import InputBar from "../../components/InputBar/InputBar";
import { isValidEmail } from "../../utils/validations";
import Button from "../../components/Button/Button";

interface Step0Props {
  informEmail: string;
  handleInformEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sendInformEmail: () => void;
}

const FindStep0: React.FC<Step0Props> = ({
  informEmail,
  handleInformEmailChange,
  sendInformEmail,
}) => {
  return (
    <>
      <h1 className={styles.FindStepTitle}>아이디/비밀번호 찾기</h1>
      <InputBar
        label="이메일"
        type="text"
        value={informEmail}
        placeholder="가입한 이메일 주소를 입력해주세요"
        onChange={handleInformEmailChange}
      />
      {informEmail && !isValidEmail(informEmail) && (
        <span className={styles.ErrorMsg}>잘못된 이메일 형식입니다.</span>
      )}
      <div style={{ marginTop: "67px" }}>
        <Button
          onClick={sendInformEmail}
          disabled={!informEmail || !isValidEmail(informEmail)}
        >
          안내 메일 받기
        </Button>
      </div>
    </>
  );
};

export default FindStep0;
