import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  friendBlockApi,
  friendDeleteApi,
  friendReportApi,
  getFriendListApi,
  GetUserFriendListResponse,
} from "@/apis/friend";
import { FRIEND_QUERY_KEY, USER_LIST_QUERY_KEY } from "@/queryKey";
import useToast from "@/shared/hooks/use-toast";

export const useFriendListQuery = () => {
  const {
    data,
    isPending: isPendingFriendList,
    isError: isErrorFriendList,
  } = useQuery<GetUserFriendListResponse>({
    queryKey: FRIEND_QUERY_KEY.FRIEND_LIST,
    queryFn: () => getFriendListApi(),
    staleTime: 1000 * 60 * 3,
  });

  const friendListData = data?.data;

  return {
    friendListData,
    isPendingFriendList,
    isErrorFriendList,
  };
};

export const useEditFriendMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: deleteFriend } = useMutation({
    mutationFn: (friendId: string) => friendDeleteApi(friendId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIEND_QUERY_KEY.FRIEND_LIST });
      qc.invalidateQueries({ queryKey: USER_LIST_QUERY_KEY.ALL });
      toast.info("삭제가 완료되었습니다.");
    },
    onError: () => {
      toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const { mutate: blockFriend } = useMutation({
    mutationFn: (reportId: number) => friendBlockApi(reportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIEND_QUERY_KEY.FRIEND_LIST });
      qc.invalidateQueries({ queryKey: USER_LIST_QUERY_KEY.ALL });
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
      qc.invalidateQueries({ queryKey: FRIEND_QUERY_KEY.FRIEND_LIST });
      qc.invalidateQueries({ queryKey: USER_LIST_QUERY_KEY.ALL });
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
