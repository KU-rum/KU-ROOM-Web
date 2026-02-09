import React from "react";

import { FriendRequestReceivedData } from "@apis/friend";
import defaultImg from "@assets/defaultProfileImg.svg";
import Button from "@components/Button/Button";

import styles from "./ReceivedFriend.module.css";

interface ReceivedFriendProps {
  receivedRequestList: FriendRequestReceivedData[] | undefined;
  setAcceptReceiveFriend: (value: string) => void;
  setAcceptReceiveFriendId: (value: number) => void;
  setModalType: (value: string) => void;
  setModalState: (value: boolean) => void;
}

const ReceivedFriend: React.FC<ReceivedFriendProps> = ({
  receivedRequestList,
  setAcceptReceiveFriend,
  setAcceptReceiveFriendId,
  setModalType,
  setModalState,
}) => {
  // 친구 요청 수락
  const handleAcceptRequest = (friend: FriendRequestReceivedData) => {
    setAcceptReceiveFriend(friend.fromUserNickname);
    setAcceptReceiveFriendId(friend.fromUserId);
    setModalType("accept");
    setModalState(true);
  };

  // 친구 요청 거절
  const handleRefuseRequest = (friend: FriendRequestReceivedData) => {
    setAcceptReceiveFriend(friend.fromUserNickname);
    setAcceptReceiveFriendId(friend.fromUserId);
    setModalType("refuse");
    setModalState(true);
  };
  if (!receivedRequestList) {
    return;
  }
  return (
    !(receivedRequestList.length === 0) && (
      <div className={styles.ReceivedList}>
        <span className={styles.ReceivedTitle}>받은 요청</span>
        {receivedRequestList.map((friend, index) => (
          <div key={index} className={styles.EachFriendContainer}>
            <div className={styles.FriendProfileWrapper}>
              {friend.imageUrl ? (
                <img
                  className={styles.ProfileImg}
                  src={friend.imageUrl}
                  alt="프로필 사진"
                />
              ) : (
                <img
                  className={styles.ProfileImg}
                  src={defaultImg}
                  alt="프로필 사진"
                />
              )}

              <span className={styles.Nickname}>{friend.fromUserNickname}</span>
            </div>
            <div className={styles.AcceptRefuseBtnWrapper}>
              <Button onClick={() => handleAcceptRequest(friend)} size="xs">
                수락
              </Button>
              <Button
                onClick={() => handleRefuseRequest(friend)}
                size="xs"
                variant="quaternary"
              >
                거절
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default ReceivedFriend;
