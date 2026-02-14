import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import { getUserProfileApi, UserProfileResponseData } from "@/apis/profile";

import { MYPAGE_QUERY_KEY } from "../querykey";

export const useUserProfile = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data: userProfileData,
    isPending: isPendingUserProfile,
    isError,
    error,
  } = useQuery<UserProfileResponseData>({
    queryKey: MYPAGE_QUERY_KEY.USER_PROFILE,
    queryFn: () => getUserProfileApi(),
    staleTime: 1000 * 60,
  });

  if (isError) {
    toast.error(`유저 정보 조회 오류 : ${error.message}`);
    navigate("/login");
  }

  return {
    userProfileData,
    isPendingUserProfile,
  };
};
