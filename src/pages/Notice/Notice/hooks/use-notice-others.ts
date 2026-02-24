import { useNoticeOthersQuery } from "@/queries";

export const useNoticeOthers = () => {
  const { noticeOthersData, isPendingNoticeOthers } = useNoticeOthersQuery();

  return {
    noticeOtehrsData: noticeOthersData,
    isPending: isPendingNoticeOthers,
  };
};
