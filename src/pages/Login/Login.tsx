import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginApi } from "@apis/auth";
import GoogleIcon from "@assets/socialLoginIcon/googleLogin.svg?react";
import KakaoIcon from "@assets/socialLoginIcon/kakaoLogin.svg?react";
import AppleIcon from "@assets/socialLoginIcon/appleLogin.svg?react";
import Button from "@components/Button/Button";
import Header from "@components/Header/Header";
import { EdgeGuard } from "@components/EdgeGuard";
import InputBar from "@components/InputBar/InputBar";
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

      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "AUTH_TOKEN",
          accessToken: accessToken,
        }),
      );

      // 전역 상태관리 zustand 사용해서 저장.
      // TODO : 추후 서버에서 소셜 로그인 상태 보내주도록 수정
      setUser({ ...userResponse, loginType: "email" });
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("로그인 중 오류 발생:", error.message); // 서버 오류(500) 같은 경우
      setIsLoginAttempted(true);
    }
  };

  // 구글 로그인 처리 함수
  const handleGoogleLogin = () => {
    const redirectUri =
      import.meta.env.VITE_REDIRECT_URI ||
      window.location.origin + "/social/callback";
    window.location.href = `https://kuroom.store/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = () => {
    const redirectUri =
      import.meta.env.VITE_REDIRECT_URI ||
      window.location.origin + "/social/callback";
    window.location.href = `https://kuroom.store/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  // 애플 로그인 처리 함수
  const handleAppleLogin = () => {
    const redirectUri =
      import.meta.env.VITE_REDIRECT_URI ||
      window.location.origin + "/social/callback";
    window.location.href = `https://kuroom.store/oauth2/authorization/apple?redirect_uri=${encodeURIComponent(redirectUri)}`;
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
      <Header onlyIcon={true} />
      <div className={styles.PageWrapper}>
        <div className={styles.MainArea}>
          <h1 className={styles.PageTitle}>
            반가워요
            <br />
            <span className={styles.KUROOMTITLE}>쿠룸</span>
            입니다.
          </h1>
          <div className={styles.InputWrapper}>
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
              marginTop: "40px",
            }}
          >
            <KakaoIcon
              onClick={handleKakaoLogin}
              style={{ cursor: "pointer" }}
              aria-label="카카오로 로그인"
            />
            <AppleIcon
              onClick={handleAppleLogin}
              style={{ cursor: "pointer" }}
              aria-label="애플로 로그인"
            />
            <GoogleIcon
              onClick={handleGoogleLogin}
              style={{ cursor: "pointer" }}
              aria-label="구글로 로그인"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
