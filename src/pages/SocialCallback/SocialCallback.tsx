import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useGetTokenByTempMutation } from "@/queries";
import Splash from "@components/Splash/Splash";

const SocialCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getTokenByTemp } = useGetTokenByTempMutation();

  const handleSocialCallback = useCallback(async () => {
    const needSignup = searchParams.get("needSignup");
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (needSignup === "true") {
      sessionStorage.setItem("preSignupToken", token);
      navigate("/agreement");
      return;
    }

    if (needSignup === "false") {
      getTokenByTemp(token);
      return;
    }

    navigate("/login");
  }, [navigate, searchParams, getTokenByTemp]);

  useEffect(() => {
    handleSocialCallback();
  }, [handleSocialCallback]);

  return <Splash />;
};

export default SocialCallback;
