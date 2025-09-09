import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginApi } from "@apis/auth";
import googleIcon from "@assets/socialLoginIcon/googleLogin.svg";
import kakaoIcon from "@assets/socialLoginIcon/kakaoLogin.svg";
import naverIcon from "@assets/socialLoginIcon/naverLogin.svg";
import Button from "@components/Button/Button";
import { EdgeGuard } from "@components/EdgeGuard";
import InputBar from "@components/InputBar/InputBar";
import TopIcon from "@components/TopIcon";
import { useUserStore } from "@stores/userStore";

import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  // 로그인 버튼을 눌렀는지 여부
  const [isLoginAttempted, setIsLoginAttempted] = useState(false);

  // Login 컴포넌트 안
  useEffect(() => {
    const preventGoBack = () => {
      // 현재 주소로 다시 push 해서 '뒤로가기'를 무효화
      window.history.pushState(null, "", window.location.href);
    };

    // 진입 시 한 번 밀어두고
    preventGoBack();
    // 뒤로가기(popstate) 시마다 다시 밀기
    window.addEventListener("popstate", preventGoBack);

    return () => {
      // 로그인 화면 벗어나면 원복 (다른 화면에선 뒤로가기 정상 동작)
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  // 상태 변경 함수
  const handleInputIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); //영어와 숫자만 허용
    setInputId(newValue);
  };
  const handleInputPwChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputPw(e.target.value);
  };

  const handleLogin = async () => {
    const loginData = { loginId: inputId, password: inputPw };
    try {
      const response = await loginApi(loginData); // `await` 추가

      if (response?.code === 1007) {
        // 서버에서 '잘못된 아이디/비밀번호'일 때의 코드 (예: 1007)
        console.log("로그인 실패: 잘못된 아이디/비밀번호");
        setIsLoginAttempted(true);
        return;
      }
      console.log("로그인 성공!", response.data);
      // 토큰 저장 후 홈으로 이동
      const {
        tokenResponse: { accessToken, refreshToken },
        userResponse,
      } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 전역 상태관리 zustand 사용해서 저장
      setUser(userResponse);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("로그인 중 오류 발생:", error.message); // 서버 오류(500) 같은 경우
      setIsLoginAttempted(true);
    }
  };

  // 구글 로그인 처리 함수
  const handleGoogleLogin = () => {
    // 현재 페이지 저장 (로그인 후 돌아올 위치)
    sessionStorage.setItem("redirectUrl", "/");

    // 구글 OAuth2 엔드포인트로 리다이렉트
    window.location.href = `https://kuroom.shop/oauth2/authorization/google`;
  };

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = () => {
    // 현재 페이지 저장 (로그인 후 돌아올 위치)
    sessionStorage.setItem("redirectUrl", "/");

    // 카카오 OAuth2 엔드포인트로 리다이렉트
    window.location.href = `https://kuroom.shop/oauth2/authorization/kakao`;
  };

  // 네이버 로그인 처리 함수
  const handleNaverLogin = () => {
    // 현재 페이지 저장 (로그인 후 돌아올 위치)
    sessionStorage.setItem("redirectUrl", "/");

    // 네이버 OAuth2 엔드포인트로 리다이렉트
    window.location.href = `https://kuroom.shop/oauth2/authorization/naver`;
  };

  // 로그인 실패 시 2초 간 보여줌
  useEffect(() => {
    if (!isLoginAttempted) return;
    const timer = setTimeout(() => setIsLoginAttempted(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [isLoginAttempted]);

  return (
    <>
      <EdgeGuard />
      <div className={styles.PageWrapper}>
        <div className={styles.MainArea}>
          <TopIcon />
          <h1 className={styles.PageTitle}>
            반가워요
            <br />
            <span className={styles.KUROOMTITLE}>쿠룸</span>
            입니다.
          </h1>
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div>
              <InputBar
                label="아이디"
                type="text"
                value={inputId}
                placeholder="아이디를 입력해주세요."
                onChange={handleInputIdChange}
              />

              <InputBar
                label="비밀번호"
                type="password"
                value={inputPw}
                placeholder="비밀번호를 입력해주세요."
                onChange={handleInputPwChange}
              />
            </div>
          </div>
          {isLoginAttempted && (
            <span className={styles.WrongLogin}>
              아이디 또는 비밀번호를 잘못 입력했습니다.
            </span>
          )}
          <div style={{ marginTop: "47px", marginBottom: "12px" }}>
            <Button onClick={handleLogin}>로그인하기</Button>
          </div>
          <div style={{ display: "flex", gap: "14px", alignSelf: "center" }}>
            <Link to="/signup" className={styles.LinkText}>
              회원가입
            </Link>
            <div
              style={{ width: "4px", height: "17px", background: "#E6EBEF" }}
            />
            <Link to="/findidpw" className={styles.LinkText}>
              아이디/비밀번호 찾기
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              gap: "47px",
              alignSelf: "center",
              marginTop: "67px",
            }}
          >
            <img
              src={kakaoIcon}
              alt="카카오로 로그인"
              onClick={handleKakaoLogin}
              style={{ cursor: "pointer" }}
            />
            <img
              src={naverIcon}
              alt="네이버로 로그인"
              onClick={handleNaverLogin}
              style={{ cursor: "pointer" }}
            />
            <img
              src={googleIcon}
              alt="구글로 로그인"
              onClick={handleGoogleLogin}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
