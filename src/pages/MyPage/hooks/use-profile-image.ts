import { useState } from "react";

import useToast from "@hooks/use-toast";

import { useProfileImageMutation } from "@/queries";

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_EXT = new Set(["png", "jpg", "jpeg", "webp"]);

export default function useProfileImage() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { updateProfileImage, getPresignedUrl, uploadToPresignedUrl } =
    useProfileImageMutation();

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
      updateProfileImage(fullUrl, {
        onSettled: () => {
          setIsOpen(false);
        },
      });
    } catch {
      // 각 mutation의 onError에서 toast 처리
    } finally {
      e.target.value = "";
    }
  };

  // 기본 이미지 적용: 서버에 null 전달
  const handleApplyDefaultImage = async () => {
    updateProfileImage(null, {
      onSettled: () => {
        setIsOpen(false);
      },
    });
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
