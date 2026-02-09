import useToast from "@/shared/hooks/use-toast";
import Header from "@components/Header/Header";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import FriendContainer from "@components/FriendContainer/FriendContainer";

import FriendEdit from "./components/FriendEdit/FriendEdit";
import FriendSearch from "../components/FriendSearch/FriendSearch";
import FriendModal from "../components/FriendModal/FriendModal";
import useFriendList from "./hooks";

import styles from "./FriendList.module.css";

const FriendList = () => {
  const toast = useToast();

  const {
    friendListData,
    searchNickname,
    filteredFriends,
    isErrorFriendList,
    isPendingFriendList,
    editPopupState,
    popupRef,
    modalState,
    modalType,
    setSearchNickname,
    setEditPopupState,
    setModalState,
    setModalType,
    handleToFriendAdd,
    handleClosePopup,
  } = useFriendList();

  if (isErrorFriendList) {
    toast.error("친구 목록을 불러오는 중 에러가 발생했습니다.");
    return;
  }

  if (isPendingFriendList) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header>친구 목록</Header>
      <div className={styles.FriendListPageWrapper}>
        <div className={styles.SearchBarContainer}>
          <FriendSearch
            searchTarget={searchNickname}
            setSearchTarget={setSearchNickname}
          />
        </div>
        <div className={styles.FriendListWrapper}>
          {friendListData &&
            (friendListData.length === 0 ? (
              <div className={styles.NoFriendsContainer}>
                <span>현재 친구가 없습니다!</span>
                <span
                  className={styles.ToFriendAdd}
                  onClick={handleToFriendAdd}
                >
                  친구 추가하러 가기
                </span>
              </div>
            ) : (
              (searchNickname ? filteredFriends : friendListData).map(
                (friend, index) => (
                  <div key={index}>
                    <FriendContainer
                      friend={friend}
                      setEditPopupState={setEditPopupState}
                    />
                  </div>
                ),
              )
            ))}
        </div>
      </div>

      {editPopupState.isPopupOpen && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: editPopupState.popupPosition.top,
            left: editPopupState.popupPosition.left,
            zIndex: 100,
          }}
        >
          <FriendEdit
            editFriend={editPopupState.editFriend}
            onClose={handleClosePopup}
            setModalType={setModalType}
            setModalState={setModalState}
          />
        </div>
      )}
      <FriendModal
        editFriend={editPopupState.editFriend}
        editFriendId={editPopupState.editFriendId}
        modalState={modalState}
        modalType={modalType}
        setModalState={setModalState}
      />
    </div>
  );
};

export default FriendList;
