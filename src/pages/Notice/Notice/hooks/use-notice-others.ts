import { useNoticeOthersQuery } from "@/queries";

export const useNoticeOthers = () => {
  const { data: noticeOtehrsData, isPending } = useNoticeOthersQuery();

  return {
    noticeOtehrsData,
    isPending,
  };
};
