import { cancelRequest, requestFriend } from "@apis/friend";
import Header from "@components/Header/Header";

import FriendSearch from "../components/FriendSearch/FriendSearch";
import FriendModal from "../components/FriendModal/FriendModal";
import RequestedFriend from "./components/RequestedFriend/RequestedFriend";
import ReceivedFriend from "./components/ReceivedFriend/ReceivedFriend";
import SearchAddFriend from "./components/SearchAddFriend/SearchAddFriend";
import styles from "./FriendAdd.module.css";
import useFriendAdd from "./hooks";
import useToast from "@/shared/hooks/use-toast";
import LoadingSpinner from "@/shared/components/LoadingSpinner/LoadingSpinner";

const FriendAdd = () => {
  const toast = useToast();

  const {
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
  } = useFriendAdd();

  // 친구 요청 취소
  const handleDeleteRequest = async (id: number) => {
    try {
      await cancelRequest(id);
    } catch (error) {
      console.error("친구요청 취소 실패 :", error);
    }
  };

  // 검색 결과에서 친구 신청/취소. 서버에 데이터 요청 필요함. 서버와 연계 시 로직 변경 예정.
  const handleSendRequest = async (id: number) => {
    try {
      const response = await requestFriend(id);
      console.log(response);
    } catch (error) {
      console.error("친구요청 실패 :", error);
    }
  };

  if (isErrorSearchedUserList || isErrorRequestList) {
    toast.error("친구 목록을 불러오는 중 에러가 발생했습니다.");
    return;
  }

  if (isPendingRequestList) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header>친구 추가</Header>
      <div className={styles.FriendAddPageWrapper}>
        <div className={styles.SearchBarContainer}>
          <FriendSearch
            searchTarget={searchNickname}
            setSearchTarget={(value) => {
              setSearchNickname(value);
            }}
          />
        </div>
        {searchNickname.trim() !== "" ? (
          // 검색 결과 렌더링
          <SearchAddFriend
            searchNickname={searchNickname}
            searchedUserList={searchedUserList}
            isPendingSearchedUserList={isPendingSearchedUserList}
            handleSendRequest={handleSendRequest}
            handleDeleteRequest={handleDeleteRequest}
            setAcceptReceiveFriend={setAcceptReceiveFriend}
            setAcceptReceiveFriendId={setAcceptReceiveFriendId}
            setModalType={setModalType}
            setModalState={setModalState}
          />
        ) : (
          <div className={styles.FriendAddListWrapper}>
            {/* 보낸 요청 */}
            <RequestedFriend
              sentRequestList={sentRequestList}
              handleDeleteRequest={handleDeleteRequest}
            />
            {sentRequestList &&
              receivedRequestList &&
              sentRequestList.length > 0 &&
              receivedRequestList.length > 0 && (
                <div className={styles.separator} />
              )}
            {/* 받은 요청 */}
            <ReceivedFriend
              receivedRequestList={receivedRequestList}
              setAcceptReceiveFriend={setAcceptReceiveFriend}
              setAcceptReceiveFriendId={setAcceptReceiveFriendId}
              setModalType={setModalType}
              setModalState={setModalState}
            />
          </div>
        )}
      </div>

      {/* 수락/거절 모달 */}
      <FriendModal
        editFriend={acceptReceiveFriend}
        editFriendId={acceptReceiveFriendId}
        modalState={modalState}
        modalType={modalType}
        setModalState={setModalState}
      />
    </>
  );
};

export default FriendAdd;
