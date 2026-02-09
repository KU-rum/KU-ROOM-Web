import { useState } from "react";

import {
  useReceivedRequestListQuery,
  useSearchedUserListQuery,
  useSentRequestListQuery,
} from "@/queries";

export default function useFriendAdd() {
  const [searchNickname, setSearchNickname] = useState("");

  const [acceptReceiveFriend, setAcceptReceiveFriend] = useState("");
  const [acceptReceiveFriendId, setAcceptReceiveFriendId] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState("");

  const {
    searchedUserList,
    isPendingSearchedUserList,
    isErrorSearchedUserList,
  } = useSearchedUserListQuery(searchNickname);

  const { sentRequestList, isPendingSentRequestList, isErrorSentRequestList } =
    useSentRequestListQuery();

  const {
    receivedRequestList,
    isPendingReceivedRequestList,
    isErrorReceivedRequestList,
  } = useReceivedRequestListQuery();

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
    setSearchNickname,
    setAcceptReceiveFriend,
    setAcceptReceiveFriendId,
    setModalState,
    setModalType,
  };
}
