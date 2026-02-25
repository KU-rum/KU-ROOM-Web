import React from "react";
import { useNavigate } from "react-router-dom";

import fanfareIcon from "@assets/icon/회원가입완료.gif";
import Button from "@components/Button/Button";

import styles from "./Welcome.module.css";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    // 로그인 페이지로 이동하는 로직
    navigate("/login");
  };

  return (
    <div className={styles["welcome-page"]}>
      <div className={styles["welcome-page-header"]}>
        <div className={styles["welcome-page-cloud"]}></div>
        <h1 className={styles["welcome-page-title"]}>
          회원가입을 완료하였습니다.
          <br />
          <span className={styles["text-primary"]}>쿠룸</span>에 오신 걸 환영합니다.
        </h1>
      </div>

      <div className={styles["welcome-page-content"]}>
        <div className={styles["fanfare-icon"]}>
          <img src={fanfareIcon} alt="환영합니다" width="300" height="300" />
        </div>
      </div>

      <div className={styles["welcome-page-button"]}>
        <Button onClick={handleLogin}>로그인</Button>
      </div>
    </div>
  );
};

export default WelcomePage;
