import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@components/Button/Button";
import Header from "@components/Header/Header";

import AgreementLabel from "./components/agreement/AgreementLabel";
import styles from "./Agreement.module.css";

const Agreement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signupId, signupPw, signupEmail } = location.state || {};

  const [allAgree, setAllAgree] = useState(false);
  const [age14, setAge14] = useState(false);
  const [privacyInfo, setPrivacyInfo] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleAllAgreeChange = () => {
    const newState = !allAgree;
    setAllAgree(newState);
    setAge14(newState);
    setPrivacyInfo(newState);
    setMarketing(newState);
  };
  const handleAge14Change = () => setAge14(!age14);
  const handlePrivacyInfoChange = () => setPrivacyInfo(!privacyInfo);
  const handleMarketingChange = () => setMarketing(!marketing);

  // 개별 동의가 변경될 때 전체 동의 상태를 업데이트
  useEffect(() => {
    setAllAgree(age14 && privacyInfo && marketing);
  }, [age14, privacyInfo, marketing]);

  // 가입완료 로직
  const handleCompleteSignup = () => {
    navigate("/profilesetting", {
      state: {
        signupEmail: signupEmail,
        signupId: signupId,
        signupPw: signupPw,
        isMarketingOk: marketing,
      },
    });
  };

  // TODO: 헤더 사용하는 것으로 바꾸기
  return (
    <>
      <Header onlyIcon={true} />
      <div className={styles.PageWrapper}>
        <div className={styles.MainArea}>
          <h1 className={styles.PageTitle}>
            회원가입을 위한
            <br />
            약관에 동의해주세요
          </h1>
          <AgreementLabel
            checked={allAgree}
            onChange={handleAllAgreeChange}
            bold={true}
          >
            약관 전체동의
          </AgreementLabel>
          <div className={styles.Line} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "17px" }}
          >
            <AgreementLabel checked={age14} onChange={handleAge14Change}>
              [필수] 만 14세 이상이며 이용 약관에 동의합니다.
            </AgreementLabel>
            <AgreementLabel
              checked={privacyInfo}
              onChange={handlePrivacyInfoChange}
            >
              [필수] 개인정보 처리방침에 동의합니다.
            </AgreementLabel>
            <AgreementLabel
              checked={marketing}
              onChange={handleMarketingChange}
            >
              [선택] 광고 및 마케팅 수신에 동의합니다.
            </AgreementLabel>
          </div>
          <div className={styles.ButtonStyle}>
            <Button
              onClick={handleCompleteSignup}
              disabled={!age14 || !privacyInfo}
            >
              프로필 설정하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Agreement;
