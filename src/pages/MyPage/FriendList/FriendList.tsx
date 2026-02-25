import Header from "@components/Header/Header";
import FriendContainer from "@components/FriendContainer/FriendContainer";
import Loading from "@components/Loading/Loading";

import FriendEdit from "./components/FriendEdit/FriendEdit";
import FriendSearch from "../components/FriendSearch/FriendSearch";
import FriendModal from "../components/FriendModal/FriendModal";
import useFriendList from "./hooks";

import styles from "./FriendList.module.css";

const FriendList = () => {
  const {
    friendListData,
    searchNickname,
    filteredFriends,
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

  if (isPendingFriendList) {
    return <Loading />;
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
                (friend) => (
                  <div key={friend.id}>
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
