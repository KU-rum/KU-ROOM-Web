import {
  GetFriendRequestReceivedListResponse,
  getReceivedRequestList,
  getSearchedUserListApi,
  getSentRequestList,
  SearchedUserListResponse,
} from "@/apis/friend";
import { USER_LIST_QUERY_KEY } from "@/queryKey";
import useDebounce from "@/shared/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

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
    staleTime: 1000 * 30,
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
    queryKey: USER_LIST_QUERY_KEY.DEFAULT,
    queryFn: () => getSentRequestList(),
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
    queryKey: USER_LIST_QUERY_KEY.DEFAULT,
    queryFn: () => getReceivedRequestList(),
  });

  const receivedRequestList = data?.data;

  return {
    receivedRequestList,
    isPendingReceivedRequestList,
    isErrorReceivedRequestList,
  };
};
