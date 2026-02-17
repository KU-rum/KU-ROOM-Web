import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";

import {
  acceptRequestApi,
  cancelRequestApi,
  getReceivedRequestListApi,
  getSearchedUserListApi,
  getSentRequestListApi,
  rejectRequestApi,
  requestFriendApi,
} from "@apis/user-list";
import {
  GetFriendRequestReceivedListResponse,
  SearchedUserListResponse,
} from "@apis/types";
import { FRIEND_QUERY_KEY, USER_LIST_QUERY_KEY } from "@/queryKey";

export const useSearchedUserListQuery = (nickname: string) => {
  const debouncedText = useDebounce(nickname, 300);

  const {
    data,
    isPending: isPendingSearchedUserList,
    isError: isErrorSearchedUserList,
  } = useQuery<SearchedUserListResponse>({
    queryKey: USER_LIST_QUERY_KEY.SEARCHED_USER(debouncedText),
    queryFn: () => getSearchedUserListApi(debouncedText),
    enabled: !!debouncedText.trim(),
    staleTime: 1000 * 60,
  });

  const searchedUserList = data?.data;

  return {
    searchedUserList,
    isPendingSearchedUserList,
    isErrorSearchedUserList,
  };
};

export const useSentRequestListQuery = () => {
  const {
    data,
    isPending: isPendingSentRequestList,
    isError: isErrorSentRequestList,
  } = useQuery<GetFriendRequestReceivedListResponse>({
    queryKey: USER_LIST_QUERY_KEY.REQUEST(),
    queryFn: () => getSentRequestListApi(),
    staleTime: 1000 * 60 * 3,
  });

  const sentRequestList = data?.data;

  return {
    sentRequestList,
    isPendingSentRequestList,
    isErrorSentRequestList,
  };
};

export const useReceivedRequestListQuery = () => {
  const {
    data,
    isPending: isPendingReceivedRequestList,
    isError: isErrorReceivedRequestList,
  } = useQuery<GetFriendRequestReceivedListResponse>({
    queryKey: USER_LIST_QUERY_KEY.RECEIVED(),
    queryFn: () => getReceivedRequestListApi(),
  });

  const receivedRequestList = data?.data;

  return {
    receivedRequestList,
    isPendingReceivedRequestList,
    isErrorReceivedRequestList,
  };
};

export const useFriendRequestMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: requestFriend } = useMutation({
    mutationFn: (receiverId: number) => requestFriendApi(receiverId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY.DEFAULT,
      });
    },
    onError: () => {
      toast.error("친구 요청에 실패했습니다.");
    },
  });

  const { mutate: cancelRequest } = useMutation({
    mutationFn: (receiverId: number) => cancelRequestApi(receiverId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY.DEFAULT,
      });
    },
    onError: () => {
      toast.error("친구 요청 취소 실패");
    },
  });

  return {
    requestFriend,
    cancelRequest,
  };
};

export const useRespondToRequestMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (receiverId: number) => acceptRequestApi(receiverId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY.DEFAULT,
      });
      qc.invalidateQueries({
        queryKey: FRIEND_QUERY_KEY.DEFAULT,
      });
    },
    onError: () => {
      toast.error("친구 요청 수락 실패");
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (receiverId: number) => rejectRequestApi(receiverId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY.DEFAULT,
      });
      qc.invalidateQueries({
        queryKey: FRIEND_QUERY_KEY.DEFAULT,
      });
    },
    onError: () => {
      toast.error("친구 요청 거절 실패");
    },
  });

  return {
    acceptRequest,
    rejectRequest,
  };
};
