import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

import useToast from "@hooks/use-toast";
import InputBar from "@components/InputBar/InputBar";
import Button from "@components/Button/Button";
import InformModal from "@components/InformModal/InformModal";
import Header from "@components/Header/Header";
import { isValidPassword } from "@utils/validations";
import { useChangePwMutation } from "@/queries";

import styles from "./ChangePw.module.css";

const ChangePw = () => {
  const [originalPw, setOriginalPw] = useState("");
  const [isOriginalPwValid, setIsOriginalPwValid] = useState(false);
  const [isAttemptReset, setIsAttemptReset] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [allowedPw, setAllowedPw] = useState(false);
  const [checkPw, setCheckPw] = useState("");
  const [isCheckedPw, setIsCheckedPw] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const [modalType, setModalType] = useState("");
  const [modalState, setModalState] = useState(false);

  const { changePwAfterLogin } = useChangePwMutation();
  const toast = useToast();

  const handleOriginalPwChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 20) {
      setOriginalPw(newValue);
    }
  };
  const handleNewPwChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 20) {
      setNewPw(e.target.value);
    }
  };
  const handleCheckPwChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 20) {
      setCheckPw(e.target.value);
    }
  };
  const handleResetPassword = async () => {
    setIsAttemptReset(true);
    setErrorCode(null);

    // 조건에 맞는지 확인
    const isValidOriginalPw = isValidPassword(originalPw);
    const isAllowedPw = isValidPassword(newPw);
    const isPwMatched = checkPw === newPw;

    setIsOriginalPwValid(isValidOriginalPw);
    setAllowedPw(isAllowedPw);
    setIsCheckedPw(isPwMatched);
    const passwords = {
      prevPassword: originalPw,
      newPassword: newPw,
    };

    // 모든 조건이 충족되었을 때 재설정 성공
    if (isValidOriginalPw && isAllowedPw && isPwMatched) {
      changePwAfterLogin(passwords, {
        onSuccess: (response) => {
          if (response.code === 310 || response.code === 311) {
            setErrorCode(response.code);
            return;
          }

          // 성공 시
          setErrorCode(null);
          setModalType("NewPassword");
          setModalState(true);
        },
      });
    } else {
      toast.error("재설정 실패: 조건을 다시 확인하세요.");
    }
  };

  return (
    <div className={styles.ChangePwPageWrapper}>
      <Header />
      <div className={styles.MainArea}>
        <h1 className={styles.ResetPwTitle}>비밀번호 재설정</h1>
        <InputBar
          label="기존 비밀번호"
          type="password"
          value={originalPw}
          placeholder="기존 비밀번호를 입력해주세요"
          onChange={handleOriginalPwChange}
        />
        {!isOriginalPwValid && isAttemptReset && (
          <span className={styles.ErrorMsg}>
            영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.
          </span>
        )}
        {errorCode === 310 && (
          <span className={styles.ErrorMsg}>
            기존 비밀번호가 일치하지 않습니다.
          </span>
        )}
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
            기존 비밀번호와 새 비밀번호가 일치할 수 없습니다.
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
          <Button
            onClick={handleResetPassword}
            disabled={!originalPw || !newPw || !checkPw}
          >
            비밀번호 재설정하기
          </Button>
        </div>
        <Link to="/findidpw" className={styles.LinkText}>
          비밀번호 찾기
        </Link>
      </div>
      <InformModal
        modalType={modalType}
        modalState={modalState}
        setModalState={setModalState}
      />
    </div>
  );
};

export default ChangePw;
