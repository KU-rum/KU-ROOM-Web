import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import checkedIcon from "@assets/icon/roundcheck.svg";
import uncheckedIcon from "@assets/icon/roundUncheck.svg";
import { sendEmailApi, verifyCodeApi } from "@apis/auth";
import InputBar from "@components/InputBar/InputBar";
import Button from "@components/Button/Button";
import Header from "@components/Header/Header";
import InformModal from "@components/InformModal/InformModal";
import { isValidEmail } from "@utils/validations";
import { useCheckIsEmailDuplicatedMutation } from "@/queries";

import styles from "./IdentityVerify.module.css";

const IdentityVerify = () => {
  const navigate = useNavigate();
  // 회원가입 로그인, 비밀번호 가져오기
  const location = useLocation();
  const { signupId, signupPw } = location.state || {};

  const [modalType, setModalType] = useState("informEmail");
  const [modalState, setModalState] = useState(false);

  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isAttemptSend, setIsAttemptSend] = useState(false); // 인증코드 전송을 했는지 여부
  const [isDuplicatedEmail, setIsDuplicatedEmail] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [isAttemptVerify, setIsAttemptVerify] = useState(false); // 인증코드를 확인한 적 있는지 여부

  const { checkIsEmailDuplicated } = useCheckIsEmailDuplicatedMutation();

  const handleVerifiedEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifiedEmail(e.target.value);
  };
  const handleVerifyCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsAttemptVerify(false);
    const newValue = e.target.value.replace(/\D/g, ""); // 숫자만 입력 가능하도록 제한
    if (newValue.length <= 6) {
      // 6자리까지만 입력 가능
      setVerifyCode(newValue);
    }
  };

  // 인증코드 발송 로직
  const sendVerifyCode = async () => {
    checkIsEmailDuplicated(verifiedEmail, {
      onSuccess: async () => {
        await sendEmailApi(verifiedEmail);
        setIsAttemptSend(true);
        setModalState(true);
      },
      onError: (error: any) => {
        if (error.response.data.code === 305) {
          setIsDuplicatedEmail(true);
        } else if (error.response.data.code === 900) {
          setModalType("EmailFailed");
          setModalState(true);
        }
      },
    });
  };

  const handleVerifyCode = async () => {
    const verifyData = {
      email: verifiedEmail,
      code: verifyCode,
    };
    // 서버에 요청해서 같은지 확인
    try {
      const response = await verifyCodeApi(verifyData);
      if (response) {
        console.log("여기");
        navigate("/agreement", {
          state: {
            signupId: signupId,
            signupPw: signupPw,
            signupEmail: verifiedEmail,
          },
        });
      }
    } catch (_) {
      setIsAttemptVerify(true);
    }
  };

  useEffect(() => {
    setIsAttemptSend(false);
    setIsAttemptVerify(false);
    setVerifyCode("");
    setIsDuplicatedEmail(false);
  }, [verifiedEmail]);

  return (
    <>
      <Header />
      <div className={styles.PageWrapper}>
        <div className={styles.MainArea}>
          <h1 className={styles.PageTitle}>본인인증</h1>
          <div style={{ position: "relative" }}>
            <InputBar
              label="이메일"
              type="email"
              value={verifiedEmail}
              placeholder="가입한 이메일 주소를 입력해주세요"
              onChange={handleVerifiedEmailChange}
            />
            <img
              src={isValidEmail(verifiedEmail) ? checkedIcon : uncheckedIcon}
              alt="올바른 형식인지 체크"
              className={styles.CheckIcon}
            />
          </div>
          {verifiedEmail && !isValidEmail(verifiedEmail) && (
            <span className={styles.ErrorMsg}>잘못된 이메일 형식입니다.</span>
          )}
          {isDuplicatedEmail && (
            <span className={styles.ErrorMsg}>이미 있는 계정입니다.</span>
          )}
          {isAttemptSend && (
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative" }}>
                <InputBar
                  label="인증코드"
                  type="text"
                  value={verifyCode}
                  placeholder="인증코드 6자리를 입력해주세요"
                  onChange={handleVerifyCodeChange}
                />
              </div>
              <button className={styles.Retransmit} onClick={sendVerifyCode}>
                이메일 재전송
              </button>
            </div>
          )}

          {isAttemptVerify && (
            <span className={styles.ErrorMsg}>잘못된 인증코드입니다.</span>
          )}
          <div className={styles.ButtonStyle}>
            {isAttemptSend ? (
              <Button
                onClick={handleVerifyCode}
                disabled={verifyCode.length !== 6}
              >
                인증하기
              </Button>
            ) : (
              <Button
                onClick={sendVerifyCode}
                disabled={!verifiedEmail || !isValidEmail(verifiedEmail)}
              >
                인증코드 발송
              </Button>
            )}
          </div>
        </div>
        <InformModal
          modalType={modalType}
          modalState={modalState}
          setModalState={setModalState}
          setModalType={setModalType}
        />
      </div>
    </>
  );
};

export default IdentityVerify;
