import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getTokenByTempTokenApi } from "@apis/auth";
import { useUserStore } from "@stores/userStore";

const SocialCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useUserStore();

  useEffect(() => {
    const handleSocialCallback = async () => {
      const needSignup = searchParams.get("needSignup");
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        if (needSignup === "true") {
          sessionStorage.setItem("preSignupToken", token);
          navigate("/agreement");
          return;
        }

        if (needSignup === "false") {
          const response = await getTokenByTempTokenApi(token);

          if (response?.code !== 200) {
            throw new Error(response?.message || "토큰 발급 실패");
          }

          if (response?.data) {
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

            setUser({ ...userResponse, loginType: "social" });
            navigate("/", { replace: true });
          } else {
            navigate("/login");
          }
          return;
        }

        navigate("/login");
      } catch (error) {
        navigate("/login");
      }
    };

    handleSocialCallback();
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

export default SocialCallback;
