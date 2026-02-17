import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import {
  addDepartmentApi,
  changeNicknameApi,
  changePwAfterLoginApi,
  changePwBeforeLoginApi,
  deleteDepartmentApi,
  getProfileImagePresignedUrlApi,
  getUserProfileApi,
  updateProfileImageApi,
  uploadToProfileImagePresignedUrlApi,
} from "@apis/profile";
import {
  ChangePwAfterLoginRequest,
  ChangePwBeforeLoginRequest,
  UserProfileResponse,
} from "@apis/types";

import { PROFILE_QUERY_KEY } from "@/queryKey";
import { NOTICE_QUERY_KEY } from "@pages/Notice/queryKey";

export const useUserProfileQuery = () => {
  const toast = useToast();
  const {
    data,
    isPending: isPendingUserProfileData,
    isError,
    error,
  } = useQuery<UserProfileResponse>({
    queryKey: PROFILE_QUERY_KEY.DEFAULT,
    queryFn: () => getUserProfileApi(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const userProfileData = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error(`유저 정보 조회 오류 : ${error.message}`);
    }
  }, [isError, toast, error]);

  return {
    userProfileData,
    isPendingUserProfileData,
  };
};

export const useChangeNicknameMutation = () => {
  const qc = useQueryClient();
  const toast = useToast();

  const { mutate: changeNickname } = useMutation({
    mutationFn: (nickname: string) => changeNicknameApi(nickname),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY.DEFAULT });
    },
    onError: () => {
      toast.error("닉네임 변경 중 오류가 발생했습니다.");
    },
  });

  return { changeNickname };
};

export const useChangePwMutation = () => {
  const qc = useQueryClient();
  const toast = useToast();

  const { mutate: changePwBeforeLogin } = useMutation({
    mutationFn: (info: ChangePwBeforeLoginRequest) =>
      changePwBeforeLoginApi(info),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY.DEFAULT });
    },
    onError: () => {
      toast.error("비밀번호 변경 중 오류가 발생했습니다.");
    },
  });

  const { mutate: changePwAfterLogin } = useMutation({
    mutationFn: (passwords: ChangePwAfterLoginRequest) =>
      changePwAfterLoginApi(passwords),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY.DEFAULT });
    },
    onError: () => {
      toast.error("비밀번호 변경 중 오류가 발생했습니다.");
    },
  });

  return {
    changePwBeforeLogin,
    changePwAfterLogin,
  };
};

export const useUserDepartmentMutation = () => {
  const toast = useToast();

  const qc = useQueryClient();

  const { mutate: addDepartment } = useMutation({
    mutationFn: (department: string) => addDepartmentApi(department),
    onSuccess: (response) => {
      qc.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.DEFAULT,
      });
      qc.invalidateQueries({
        queryKey: NOTICE_QUERY_KEY.OTHERS,
      });
      toast.info(response);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteDepartment } = useMutation({
    mutationFn: (department: string) => deleteDepartmentApi(department),
    onSuccess: (response) => {
      qc.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.DEFAULT,
      });
      qc.invalidateQueries({
        queryKey: NOTICE_QUERY_KEY.OTHERS,
      });
      toast.info(response);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    addDepartment,
    deleteDepartment,
  };
};

export const useProfileImageMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: updateProfileImage } = useMutation({
    mutationFn: (imageUrl: string | null) => updateProfileImageApi(imageUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY.DEFAULT });
      toast.info("이미지가 성공적으로 변경되었습니다.");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "unknown error";
      toast.error(`이미지 변경 실패: ${message}`);
    },
  });

  const { mutateAsync: getPresignedUrl } = useMutation({
    mutationFn: ({
      fileName,
      fileType,
    }: {
      fileName: string;
      fileType: string;
    }) => getProfileImagePresignedUrlApi(fileName, fileType),
    onError: (error) => {
      toast.error(`presigned url 발급 실패: ${error.message}`);
    },
  });

  const { mutateAsync: uploadToPresignedUrl } = useMutation({
    mutationFn: ({
      presignedUrl,
      file,
    }: {
      presignedUrl: string;
      file: File;
    }) => uploadToProfileImagePresignedUrlApi(presignedUrl, file),
    onError: (error) => {
      toast.error(`S3 업로드 실패: ${error.message}`);
    },
  });

  return {
    updateProfileImage,
    getPresignedUrl,
    uploadToPresignedUrl,
  };
};
