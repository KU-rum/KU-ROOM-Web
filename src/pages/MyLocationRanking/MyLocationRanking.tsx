import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import rank1Icon from "@assets/icon/ranking/rank1.png";
import rank2Icon from "@assets/icon/ranking/rank2.png";
import rank3Icon from "@assets/icon/ranking/rank3.png";
import kuroomEmptyIcon from "@assets/icon/kuroom-icon/kuroom-gray.svg";

import { getSharingRanking } from "@apis/home";
import Header from "@components/Header/Header";
// import Button from "@components/Button/Button";
import { RankListType } from "@/shared/types";

import ShareBottomSheet from "./components/ShareBottomSheet/ShareBottomSheet";
import styles from "./MyLocationRanking.module.css";

const dummyFriendRanking = [
  {
    id: 1,
    nickname: "쿠룸",
  },
  {
    id: 2,
    nickname: "쿠룸쿠룸",
  },
];

const MyLocationRanking = () => {
  const navigate = useNavigate();

  const [myRankData, setMyRankData] = useState<RankListType[]>([]);

  const [isSharedSheetOpen, setIsSharedSheetOpen] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const getMyLocationRanking = async () => {
    try {
      const response = await getSharingRanking();
      console.log(response);
      setMyRankData(response);
    } catch (error) {
      console.error("내 장소 랭킹 조회 중 에러", error);
    }
  };

  const handleNavToFriendRanking = (nickname: string) => {
    navigate("friendlocationranking", { state: { nickname: nickname } });
  };

  // const openBottomSheet = () => {
  //   console.log("공유하기");
  //   setIsSheetVisible(true); // 먼저 보여주기
  //   setTimeout(() => setIsSharedSheetOpen(true), 0); // 열리는 애니메이션 트리거
  // };
  const closeBottomSheet = () => {
    setIsSharedSheetOpen(false); // 닫히는 애니메이션 시작
    setTimeout(() => setIsSheetVisible(false), 300); // 0.3초 후 제거
  };

  useEffect(() => {
    getMyLocationRanking();
  }, []);

  return (
    <div>
      <Header>내 장소 랭킹</Header>
      <div className={styles.PageContentWrapper}>
        <div className={styles.MyRankingContainer}>
          {myRankData.length === 0 && (
            <div className={styles.EmptyViewContainer}>
              <img src={kuroomEmptyIcon} className={styles.EmptyIcon} />
              <span className={styles.EmptyText}>
                아직 위치를 공유하지 않았어요.
                <br /> 1시간 이상 위치 공유를 유지해야 1회로 인정됩니다.
              </span>
            </div>
          )}
          {myRankData.map((item, index) => (
            <div key={index} className={styles.EachRankingContainer}>
              <img
                className={styles.RankIcon}
                src={
                  index === 0 ? rank1Icon : index === 1 ? rank2Icon : rank3Icon
                }
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
          ))}
        </div>
        <div className={styles.FriendRankingContainer}>
          <span className={styles.FriendRankingTitle}>친구 랭킹</span>
          <div className={styles.FriendWrapper}>
            {dummyFriendRanking.map((friend) => (
              <button
                key={friend.id}
                className={styles.FriendNickname}
                onClick={() => handleNavToFriendRanking(friend.nickname)}
              >
                {friend.nickname}
              </button>
            ))}
          </div>
        </div>
        {/* TODO: 공유 기능은 후순위로 미루기(10/13) */}
        {/* <div className={styles.ButtonWrapper}>
          <Button onClick={openBottomSheet}>공유하기</Button>
        </div> */}
      </div>
      {isSheetVisible && (
        <div className={styles.BottomSheetOverlay} onClick={closeBottomSheet}>
          <div
            className={styles.ShareBottomSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <ShareBottomSheet isSharedSheetOpen={isSharedSheetOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLocationRanking;
