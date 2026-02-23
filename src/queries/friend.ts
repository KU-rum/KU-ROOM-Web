import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import {
  friendBlockApi,
  friendDeleteApi,
  friendReportApi,
  getFriendListApi,
} from "@apis/friend";
import { GetUserFriendListResponse } from "@apis/types";
import { FRIEND_QUERY_KEY, USER_LIST_QUERY_KEY } from "@/queryKey";

export const useFriendListQuery = () => {
  const toast = useToast();
  const {
    data,
    isPending: isPendingFriendList,
    isError,
    error,
  } = useQuery<GetUserFriendListResponse>({
    queryKey: FRIEND_QUERY_KEY.DEFAULT,
    queryFn: () => getFriendListApi(),
    staleTime: 1000 * 60 * 3,
  });

  const friendListData = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error(`친구 목록 조회 오류 : ${error.message}`);
    }
  }, [isError, toast, error]);

  return {
    friendListData,
    isPendingFriendList,
  };
};

export const useEditFriendMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: deleteFriend } = useMutation({
    mutationFn: (friendId: string) => friendDeleteApi(friendId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIEND_QUERY_KEY.DEFAULT });
      qc.invalidateQueries({ queryKey: USER_LIST_QUERY_KEY.DEFAULT });
      toast.info("삭제가 완료되었습니다.");
    },
    onError: () => {
      toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const { mutate: blockFriend } = useMutation({
    mutationFn: (reportId: number) => friendBlockApi(reportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIEND_QUERY_KEY.DEFAULT });
      qc.invalidateQueries({ queryKey: USER_LIST_QUERY_KEY.DEFAULT });
      toast.info("차단이 완료되었습니다.");
    },
    onError: () => {
      toast.error("차단에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const { mutate: reportFriend } = useMutation({
    mutationFn: ({ reportId, reason }: { reportId: number; reason: string }) =>
      friendReportApi(reportId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIEND_QUERY_KEY.DEFAULT });
      qc.invalidateQueries({ queryKey: USER_LIST_QUERY_KEY.DEFAULT });
      toast.info("신고가 완료되었습니다.");
    },
    onError: () => {
      toast.error("신고에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    deleteFriend,
    blockFriend,
    reportFriend,
  };
};
