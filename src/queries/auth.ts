import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import { useUserStore } from "@stores/userStore";
import { loginApi, logoutApi, signupApi, withdrawApi } from "@apis/auth";
import { LoginRequest, LoginResponse, SignupRequest } from "@apis/types";
import { clearAuthStorage } from "@/shared/utils/storageUtils";

export const useSignupMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: signup, isPending: isPendingSignup } = useMutation({
    mutationFn: (userData: SignupRequest) => signupApi(userData),
    onSuccess: (response: any) => {
      if (response.length > 1 || response.code !== 200) {
        toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
        navigate("/login");
      } else {
        navigate("/welcome");
      }
    },
  });

  return {
    signup,
    isPendingSignup,
  };
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const { mutate: login, isPending: isPendingLogin } = useMutation({
    mutationFn: ({ loginId, password }: LoginRequest) =>
      loginApi({ loginId, password }),
    onSuccess: (response: LoginResponse) => {
      if (!response.data?.tokenResponse) throw Error();

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
      setUser({ ...userResponse, loginType: "email" });
      navigate("/", { replace: true });
    },
  });

  return {
    login,
    isPendingLogin,
  };
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: logout } = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      toast.info("로그아웃되었습니다.");
      navigate("/login");
      clearAuthStorage();
    },
    onError: () => {
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    logout,
  };
};

export const useWithdrawMutation = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: withdraw } = useMutation({
    mutationFn: () => withdrawApi(),
    onSuccess: () => {
      toast.info("회원탈퇴 완료");
      navigate("/login");
      clearAuthStorage();
    },
    onError: () => {
      toast.error("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    withdraw,
  };
};
