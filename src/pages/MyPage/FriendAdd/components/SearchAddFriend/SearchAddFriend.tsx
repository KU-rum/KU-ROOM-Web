import React from "react";

import noResultIcon from "@assets/icon/noResultSearch.svg";
import defaultImg from "@assets/defaultProfileImg.svg";
import Button from "@components/Button/Button";

import styles from "./SearchAddFriend.module.css";
import { SearchedUserData } from "@apis/user-list";

interface SearchAddFriendProps {
  searchNickname: string;
  searchedUserList: SearchedUserData[] | undefined;
  isPendingSearchedUserList: boolean;
  handleSendRequest: (id: number) => void;
  handleDeleteRequest: (id: number) => void;
  setAcceptReceiveFriend: (value: string) => void;
  setAcceptReceiveFriendId: (value: number) => void;
  setModalType: (value: string) => void;
  setModalState: (value: boolean) => void;
}

const SearchAddFriend: React.FC<SearchAddFriendProps> = ({
  searchNickname,
  searchedUserList,
  isPendingSearchedUserList,
  handleSendRequest,
  handleDeleteRequest,
  setAcceptReceiveFriend,
  setAcceptReceiveFriendId,
  setModalType,
  setModalState,
}) => {
  if (!searchNickname) return null;

  // 친구 요청 수락
  const handleAcceptRequest = (friend: SearchedUserData) => {
    setAcceptReceiveFriend(friend.nickname);
    setAcceptReceiveFriendId(friend.userId);
    setModalType("accept");
    setModalState(true);
  };

  return (
    <div className={styles.SearchResultContainer}>
      {searchedUserList && searchedUserList.length > 0 ? (
        searchedUserList.map((user) => {
          return (
            <div key={user.userId} className={styles.EachFriendContainer}>
              <div className={styles.FriendProfileWrapper}>
                {user.imageUrl ? (
                  <img
                    className={styles.ProfileImg}
                    src={user.imageUrl}
                    alt="프로필 사진"
                  />
                ) : (
                  <img
                    className={styles.ProfileImg}
                    src={defaultImg}
                    alt="프로필 사진"
                  />
                )}
                <span className={styles.Nickname}>{user.nickname}</span>
              </div>
              {user.isFriend ? (
                <div className={styles.BtnWrapper}>
                  <Button onClick={() => {}} size="xs" disabled={true}>
                    친구
                  </Button>
                </div>
              ) : user.requestReceived ? (
                <div className={styles.BtnWrapper}>
                  <Button onClick={() => handleAcceptRequest(user)} size="xs">
                    수락
                  </Button>
                </div>
              ) : (
                <div className={styles.BtnWrapper}>
                  {user.requestSent ? (
                    <Button
                      onClick={() => handleDeleteRequest(user.userId)}
                      size="xs"
                      variant="quaternary"
                    >
                      신청취소
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSendRequest(user.userId)}
                      size="xs"
                      variant="primary"
                    >
                      친구신청
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className={styles.NoSearchResultWrapper}>
          <img
            className={styles.NoSearchResultIcon}
            src={noResultIcon}
            alt="검색 결과 없음"
          />
          <span className={styles.NoSearchResultText}>
            {isPendingSearchedUserList
              ? "검색 중입니다..."
              : "검색 결과가 없어요!"}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchAddFriend;
