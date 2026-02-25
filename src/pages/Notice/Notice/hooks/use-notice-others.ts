import { useNoticeOthersQuery } from "@/queries";

export const useNoticeOthers = () => {
  const { noticeOthersData, isPendingNoticeOthers } = useNoticeOthersQuery();

  return {
    noticeOthersData: noticeOthersData,
    isPending: isPendingNoticeOthers,
  };
};
