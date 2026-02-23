import { useEffect, useState } from "react";

import useToast from "@hooks/use-toast";
import {
  useReceivedRequestListQuery,
  useSearchedUserListQuery,
  useSentRequestListQuery,
  useFriendRequestMutation,
} from "@/queries";

export default function useFriendAdd() {
  const toast = useToast();
  const [searchNickname, setSearchNickname] = useState("");

  const [acceptReceiveFriend, setAcceptReceiveFriend] = useState("");
  const [acceptReceiveFriendId, setAcceptReceiveFriendId] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState("");

  // 검색 결과
  const {
    searchedUserList,
    isPendingSearchedUserList,
    isErrorSearchedUserList,
  } = useSearchedUserListQuery(searchNickname);

  // 보낸 요청 리스트
  const { sentRequestList, isPendingSentRequestList, isErrorSentRequestList } =
    useSentRequestListQuery();

  // 받은 요청 리스트
  const {
    receivedRequestList,
    isPendingReceivedRequestList,
    isErrorReceivedRequestList,
  } = useReceivedRequestListQuery();

  // 친구 요청 및 보낸 요청 취소
  const { requestFriend, cancelRequest } = useFriendRequestMutation();

  const isPendingRequestList =
    isPendingSentRequestList || isPendingReceivedRequestList;

  const isErrorRequestList =
    isErrorSentRequestList || isErrorReceivedRequestList;

  useEffect(() => {
    if (isErrorRequestList) {
      toast.error("요청 목록을 불러오는 중 에러가 발생했습니다.");
      return;
    }

    if (isErrorSearchedUserList) {
      toast.error("검색 중 오류가 발생했습니다.");
    }
  }, [isErrorSearchedUserList, isErrorRequestList, toast]);

  return {
    sentRequestList,
    receivedRequestList,
    searchNickname,
    searchedUserList,
    isPendingRequestList,
    isPendingSearchedUserList,
    isErrorRequestList,
    acceptReceiveFriend,
    acceptReceiveFriendId,
    modalState,
    modalType,
    requestFriend,
    cancelRequest,
    setSearchNickname,
    setAcceptReceiveFriend,
    setAcceptReceiveFriendId,
    setModalState,
    setModalType,
  };
}
