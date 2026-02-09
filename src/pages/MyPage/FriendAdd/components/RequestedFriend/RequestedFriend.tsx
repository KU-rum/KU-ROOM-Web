import defaultImg from "@assets/defaultProfileImg.svg";
import deleteIcon from "@assets/icon/deleteIcon.svg";

import styles from "./RequestedFriend.module.css";
import { FriendRequestReceivedData } from "@/apis/friend";

interface RequestedFriendProps {
  sentRequestList: FriendRequestReceivedData[] | undefined;
  handleDeleteRequest: (id: number) => void;
}

const RequestedFriend = ({
  sentRequestList,
  handleDeleteRequest,
}: RequestedFriendProps) => {
  if (!sentRequestList) {
    return;
  }

  return (
    !(sentRequestList.length === 0) && (
      <div className={styles.RequestList}>
        <span className={styles.RequestTitle}>보낸 요청</span>
        {sentRequestList.map((friend, index) => (
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
            <img
              className={styles.DeleteIcon}
              src={deleteIcon}
              alt="요청 삭제"
              onClick={() => handleDeleteRequest(friend.fromUserId)}
            />
          </div>
        ))}
      </div>
    )
  );
};

export default RequestedFriend;
