import { useNavigate } from "react-router-dom";

import rank1Icon from "@assets/icon/ranking/rank1.png";
import rank2Icon from "@assets/icon/ranking/rank2.png";
import rank3Icon from "@assets/icon/ranking/rank3.png";
import kuroomEmptyIcon from "@assets/icon/kuroom-icon/kuroom-gray.svg";
import Button from "@components/Button/Button";
import Header from "@components/Header/Header";

// import ShareBottomSheet from "./components/ShareBottomSheet/ShareBottomSheet";
import useLocationRanking from "./hooks/use-location-ranking";

import styles from "./MyLocationRanking.module.css";

const MyLocationRanking = () => {
  const navigate = useNavigate();

  const {
    userRankingData,
    friendListData,
    isPendingUserRanking,
    isPendingFriendList,
  } = useLocationRanking();

  const handleNavToFriendRanking = (nickname: string, friendId: number) => {
    navigate("friendlocationranking", {
      state: { nickname, friendId: String(friendId) },
    });
  };

  const handleToAddFriendPage = () => {
    navigate("/friendadd");
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return rank1Icon;
      case 1:
        return rank2Icon;
      case 2:
        return rank3Icon;
      default:
        return;
    }
  };

  // TODO: 추후 기능 추가
  // const [isSharedSheetOpen, setIsSharedSheetOpen] = useState(false);
  // const [isSheetVisible, setIsSheetVisible] = useState(false);
  // const openBottomSheet = () => {
  //   console.log("공유하기");
  //   setIsSheetVisible(true); // 먼저 보여주기
  //   setTimeout(() => setIsSharedSheetOpen(true), 0); // 열리는 애니메이션 트리거
  // };
  // const closeBottomSheet = () => {
  //   setIsSharedSheetOpen(false); // 닫히는 애니메이션 시작
  //   setTimeout(() => setIsSheetVisible(false), 300); // 0.3초 후 제거
  // };

  if (isPendingFriendList || isPendingUserRanking) {
    return <div>불러오는 중...</div>;
  }

  if (userRankingData === undefined || friendListData === undefined) {
    return;
  }

  return (
    <div>
      <Header>내 장소 랭킹</Header>
      <div className={styles.PageContentWrapper}>
        <div className={styles.MyRankingContainer}>
          {userRankingData.length === 0 ? (
            <div className={styles.EmptyViewContainer}>
              <img src={kuroomEmptyIcon} className={styles.EmptyIcon} />
              <span className={styles.EmptyText}>
                아직 위치를 공유하지 않았어요.
              </span>
            </div>
          ) : (
            // TODO: 우선 3위까지만. 추후 변동 가능
            userRankingData.slice(0, 3).map((item, index) => (
              <div key={index} className={styles.EachRankingContainer}>
                <img
                  className={styles.RankIcon}
                  src={getRankIcon(index)}
                  alt="랭킹 아이콘"
                />
                <div className={styles.EachRankingContentWrapper}>
                  <div className={styles.EachRankLocationNameWrapper}>
                    {item.name.map((location) => (
                      <span key={location} className={styles.EachRankLocation}>
                        {location}
                      </span>
                    ))}
                  </div>
                  <span className={styles.EachRankCount}>
                    {item.sharingCount}회
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.FriendRankingContainer}>
          <span className={styles.FriendRankingTitle}>친구 랭킹</span>
          {friendListData.length === 0 ? (
            // TODO: 디자인 변경 가능성 있음
            <div className={styles.EmptyViewContainer}>
              <div className={styles.EmtpyFriendWrapper}>
                <span className={styles.EmptyText}>아직 친구가 없어요.</span>
                <Button size="xs" onClick={handleToAddFriendPage}>
                  친구 추가하러 가기
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.FriendWrapper}>
              {friendListData.map((friend) => (
                <button
                  key={friend.id}
                  className={styles.FriendNickname}
                  onClick={() =>
                    handleNavToFriendRanking(friend.nickname, friend.id)
                  }
                >
                  {friend.nickname}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* TODO: 공유 기능은 후순위로 미루기(10/13) */}
        {/* <div className={styles.ButtonWrapper}>
          <Button onClick={openBottomSheet}>공유하기</Button>
        </div> */}
      </div>
      {/* {isSheetVisible && (
        <div className={styles.BottomSheetOverlay} onClick={closeBottomSheet}>
          <div
            className={styles.ShareBottomSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <ShareBottomSheet isSharedSheetOpen={isSharedSheetOpen} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MyLocationRanking;
