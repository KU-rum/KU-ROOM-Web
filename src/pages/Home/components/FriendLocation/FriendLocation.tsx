import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import arrowRight from "@assets/nav/arrowRight.svg";
import locationIcon from "@assets/icon/locationIcon.png";
import DefaultProfileImg from "@assets/defaultProfileImg.svg";
import kuroomEmptyIcon from "@assets/icon/kuroom-icon/kuroom-gray.svg";
import { PlaceData } from "@/shared/types";

import styles from "./FriendLocation.module.css";
import { getCategoryLocationsApi } from "@/apis/map";

interface FriendLocationProps {
  userSharedLocation: string | null;
}

const FriendLocation: React.FC<FriendLocationProps> = ({
  userSharedLocation,
}) => {
  const navigate = useNavigate();
  const [friendSharedLocationData, setFriendSharedLocationData] = useState<
    PlaceData[]
  >([]);
  // 화면 너비에 따라 개수 다르게 보이기. 크기에 따라 최대 3 혹은 4개
  const [maxVisibleFriends, setMaxVisibleFriends] = useState(4);

  const getFriendLocation = async () => {
    try {
      const response = await getCategoryLocationsApi("FRIEND");
      console.log("위치 공유한 친구 배열 : ", response);
      setFriendSharedLocationData(response);
    } catch (error) {
      console.error("위치 공유한 친구 배열 조회 중 오류 : ", error);
    }
  };

  useEffect(() => {
    const updateVisibleFriends = () => {
      setMaxVisibleFriends(window.innerWidth < 410 ? 3 : 4);
    };

    updateVisibleFriends(); // 초기 실행
    window.addEventListener("resize", updateVisibleFriends);

    getFriendLocation();

    return () => window.removeEventListener("resize", updateVisibleFriends);
  }, []);

  const handleClickArrow = () => {
    console.log("지도로 이동");
    navigate("/map");
  };

  return (
    <div className={styles.FriendLocationContentWrapper}>
      <div className={styles.FriendLocationSectionTitle}>
        <div className={styles.TitleWrapper}>
          <h1 className={styles.SectionTitleBold}>친구 위치 공유</h1>
          <span className={styles.NormalText}>
            친구들이 어디에 있는지 알려드릴게요 :)
          </span>
        </div>
        <img
          className={styles.ArrowButton}
          src={arrowRight}
          alt="자세히 보기"
          onClick={handleClickArrow}
        />
      </div>

      {friendSharedLocationData.length === 0 && (
        <div className={styles.EmptyViewContainer}>
          <img src={kuroomEmptyIcon} className={styles.EmptyIcon} />
          <span className={styles.EmptyText}>
            아직 위치를 공유한 친구가 없어요.
            <br />
            친구들과 함께 서로의 위치를 공유해보세요.
          </span>
        </div>
      )}

      {friendSharedLocationData.map((item, index) => {
        const shouldShowMore = item.friends.length > maxVisibleFriends;
        const visibleFriends = item.friends.slice(0, maxVisibleFriends);

        return (
          <div
            key={index}
            className={`${styles.EachLocationWrapper} 
            ${userSharedLocation === item.name ? styles.HighlightBorder : ""}`}
          >
            <div className={styles.EachLocationTitleWrapper}>
              <img
                className={styles.LocationIcon}
                src={locationIcon}
                alt="핀포인트 아이콘"
              />
              <h1 className={styles.EachLocationTitle}>{item.name}</h1>
            </div>

            <div className={styles.LocationFriendWrapper}>
              {visibleFriends.map((friend, index) => (
                <div key={index} className={styles.EachFriendProfile}>
                  <img
                    style={{ width: "49px", height: "49px" }}
                    src={friend.profileURL || DefaultProfileImg}
                    alt="프로필 사진"
                  />
                  <span className={styles.Nickname}>{friend.nickname}</span>
                </div>
              ))}

              {shouldShowMore && (
                <button
                  className={styles.EachFriendProfile}
                  onClick={() => console.log("더보기 클릭")}
                >
                  <div className={styles.LearnMoreWrapper}>
                    <div className={styles.Dotstyle} />
                    <div className={styles.Dotstyle} />
                    <div className={styles.Dotstyle} />
                  </div>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendLocation;
