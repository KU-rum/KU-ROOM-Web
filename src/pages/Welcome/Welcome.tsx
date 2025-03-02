import React from "react";
import "./Welcome.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import fanfareIcon from "../../assets/icon/폭죽.png";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    // 로그인 페이지로 이동하는 로직
    navigate("/login");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-page-header">
        <div className="welcome-page-cloud"></div>
        <h1 className="welcome-page-title">
          회원가입을 완료하였습니다.
          <br />
          <span className="text-primary">쿠룸</span>에 오신 걸 환영합니다.
        </h1>
      </div>

      <div className="welcome-page-content">
        <div className="fanfare-icon">
          <img src={fanfareIcon} alt="환영합니다" width="300" height="300" />
        </div>
      </div>

      <div className="welcome-page-button">
        <Button onClick={handleLogin}>로그인</Button>
      </div>
    </div>
  );
};

export default WelcomePage;
