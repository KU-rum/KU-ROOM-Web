import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTokenByAuthCode } from "../../apis/auth";
import { useUserStore } from "../../stores/userStore";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useUserStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // 현재 URL 전체 확인
      console.log("현재 URL:", window.location.href);
      console.log("전체 URL 파라미터:", Object.fromEntries(searchParams));

      // URL에서 token, authCode, code 파라미터 확인
      const authCode =
        searchParams.get("token") ||
        searchParams.get("authCode") ||
        searchParams.get("code");

      console.log("받은 authCode:", authCode);

      if (!authCode) {
        console.error("AuthCode가 없습니다.");
        console.error(
          "사용 가능한 파라미터들:",
          Array.from(searchParams.keys())
        );
        alert(
          "AuthCode를 찾을 수 없습니다. 개발자 도구 Console을 확인해주세요."
        );
        return;
      }

      try {
        console.log("토큰 교환 요청 중...", authCode);
        // 임시 토큰으로 실제 토큰 발급받기
        const response = await getTokenByAuthCode(authCode);

        console.log("토큰 교환 응답:", response);

        if (response?.data) {
          // 성공 조건 확인
          const {
            tokenResponse: { accessToken, refreshToken },
            userResponse,
            isFirstLogin,
          } = response.data;

          // 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // 유저 정보 저장
          setUser(userResponse);

          console.log("OAuth 로그인 성공!");
          console.log("첫 로그인 여부:", isFirstLogin);

          // 첫 로그인인지 여부에 따라 페이지 이동
          if (isFirstLogin) {
            // 첫 로그인이면 동의 페이지로 이동
            navigate("/agreement");
          } else {
            // 기존 로그인이면 홈으로 이동 (또는 이전 페이지로)
            console.log("기존 로그인 - 홈으로 이동");
            const redirectUrl = sessionStorage.getItem("redirectUrl") || "/";
            sessionStorage.removeItem("redirectUrl");
            navigate(redirectUrl);
          }
        } else {
          console.error("토큰 교환 실패:", response);
          navigate("/login");
        }
      } catch (error) {
        console.error("OAuth 토큰 교환 중 오류:", error);
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>로그인 처리 중...</div>
    </div>
  );
};

export default OAuthCallback;
