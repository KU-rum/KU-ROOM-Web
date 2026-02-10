import { useState } from "react";

import {
  useReceivedRequestListQuery,
  useSearchedUserListQuery,
  useSentRequestListQuery,
} from "@/queries";
import { useFriendRequestMutation } from "@/queries/user-list";

export default function useFriendAdd() {
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

  return {
    sentRequestList,
    receivedRequestList,
    searchNickname,
    searchedUserList,
    isPendingRequestList,
    isPendingSearchedUserList,
    isErrorRequestList,
    isErrorSearchedUserList,
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
