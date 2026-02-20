import { useMutation } from "@tanstack/react-query";

import { signupApi } from "@apis/auth";
import { SignupRequest } from "@apis/types";
import useToast from "@/shared/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
