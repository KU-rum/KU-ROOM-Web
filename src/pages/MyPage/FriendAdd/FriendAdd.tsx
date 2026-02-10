import Header from "@components/Header/Header";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";

import FriendSearch from "../components/FriendSearch/FriendSearch";
import FriendModal from "../components/FriendModal/FriendModal";
import RequestedFriend from "./components/RequestedFriend/RequestedFriend";
import ReceivedFriend from "./components/ReceivedFriend/ReceivedFriend";
import SearchAddFriend from "./components/SearchAddFriend/SearchAddFriend";
import useFriendAdd from "./hooks";

import styles from "./FriendAdd.module.css";

const FriendAdd = () => {
  const {
    sentRequestList,
    receivedRequestList,
    searchNickname,
    searchedUserList,
    isPendingRequestList,
    isPendingSearchedUserList,
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
  } = useFriendAdd();

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
            handleSendRequest={requestFriend}
            handleDeleteRequest={cancelRequest}
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
              handleDeleteRequest={cancelRequest}
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
