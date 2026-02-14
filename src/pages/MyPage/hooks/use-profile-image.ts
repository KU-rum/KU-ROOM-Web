import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import {
  getPresignedUrlApi,
  updateProfileImageApi,
  uploadToPresignedUrlApi,
} from "@/apis/profile";

import { MYPAGE_QUERY_KEY } from "../querykey";

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_EXT = new Set(["png", "jpg", "jpeg", "webp"]);

export default function useProfileImage() {
  const toast = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updateProfileImage } = useMutation({
    mutationFn: (imageUrl: string | null) => updateProfileImageApi(imageUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MYPAGE_QUERY_KEY.USER_PROFILE });
      toast.info("이미지가 성공적으로 변경되었습니다.");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "unknown error";
      toast.error(`이미지 변경 실패: ${message}`);
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: getPresignedUrl } = useMutation({
    mutationFn: ({
      fileName,
      fileType,
    }: {
      fileName: string;
      fileType: string;
    }) => getPresignedUrlApi(fileName, fileType),
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
    }) => uploadToPresignedUrlApi(presignedUrl, file),
    onError: (error) => {
      toast.error(`S3 업로드 실패: ${error.message}`);
    },
  });

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    const okByMime = file.type ? ALLOWED_MIME.has(file.type) : false;
    const okByExt = ALLOWED_EXT.has(ext);

    if (!okByMime && !okByExt) {
      toast.error("JPG, JPEG, PNG, WEBP 파일만 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    try {
      // 1) presigned 발급
      const presignedResponse = await getPresignedUrl({
        fileName: file.name,
        fileType: file.type,
      });

      const { presignedUrl, fullUrl } = presignedResponse.data;

      // 2) S3 업로드 (파일 자체 PUT)
      await uploadToPresignedUrl({
        presignedUrl,
        file,
      });

      // 3) 업로드 성공 후 fullUrl을 서버에 저장(프로필 변경)
      updateProfileImage(fullUrl);
    } catch {
      // 각 mutation의 onError에서 toast 처리
    } finally {
      e.target.value = "";
    }
  };

  // 기본 이미지 적용: 서버에 null 전달
  const handleApplyDefaultImage = async () => {
    updateProfileImage(null);
  };

  const handleOpenProfileImageSheet = () => {
    setIsOpen(true);
  };
  const handleCloseProfileImageSheet = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    handleOpenProfileImageSheet,
    handleCloseProfileImageSheet,
    handleChangeFile,
    handleApplyDefaultImage,
  };
}
