import { useQuery } from "@tanstack/react-query";

import useDebounce from "@hooks/use-debounce";
import { USER_LIST_QUERY_KEY } from "@/queryKey";

import {
  GetFriendRequestReceivedListResponse,
  getReceivedRequestList,
  getSearchedUserListApi,
  getSentRequestList,
  SearchedUserListResponse,
} from "@/apis/user-list";

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
    queryFn: () => getSentRequestList(),
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
    queryFn: () => getReceivedRequestList(),
  });

  const receivedRequestList = data?.data;

  return {
    receivedRequestList,
    isPendingReceivedRequestList,
    isErrorReceivedRequestList,
  };
};
