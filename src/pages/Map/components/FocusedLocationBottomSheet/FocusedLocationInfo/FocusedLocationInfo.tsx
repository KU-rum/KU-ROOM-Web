import React from "react";
import { useNavigate } from "react-router-dom";

import DefaultProfileImg from "@assets/defaultProfileImg.svg";
import Rank1Icon from "@assets/icon/ranking/rank1.png";
import Rank2Icon from "@assets/icon/ranking/rank2.png";
import Rank3Icon from "@assets/icon/ranking/rank3.png";
import ArrowRight from "@assets/nav/arrowRight.svg";
import { DetailPlaceData } from "@/shared/types";
import { useLocationTop3RankQuery } from "@/queries";

import styles from "./FocusedLocationInfo.module.css";

interface FocusedLocationInfo {
  detailInfo: DetailPlaceData;
  isExpandedFocusedSheet: boolean;
  setIsExpandedFocusedSheet: (value: boolean) => void;
}

const FocusedLocationInfo: React.FC<FocusedLocationInfo> = ({
  detailInfo,
  isExpandedFocusedSheet,
  setIsExpandedFocusedSheet,
}) => {
  const navigate = useNavigate();

  const { top3RankData, isTop3Pending } = useLocationTop3RankQuery(
    detailInfo.placeId,
  );

  const handleNavigateToTotalRank = () => {
    if (!detailInfo) return;
    navigate(
      `/map/location-total-rank/${encodeURIComponent(detailInfo.name)}`,
      { state: { placeId: detailInfo.placeId } },
    );
  };

  if (isTop3Pending) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.DetailInfoWrapper}>
      {detailInfo && (
        <>
          <div className={styles.TitleWrapper}>
            <span
              className={styles.TitleText}
              onClick={() => setIsExpandedFocusedSheet(true)}
            >
              {detailInfo.name}
            </span>
            <span className={styles.SubTitleText}>{detailInfo.subName}</span>
          </div>
          {isExpandedFocusedSheet &&
            top3RankData &&
            top3RankData.length > 0 && (
              <div className={styles.TotalRankWrapper}>
                {top3RankData.map((rankData) => (
                  <div key={rankData.ranking} className={styles.RankContainer}>
                    {rankData.ranking === 1 ? (
                      <img style={{ width: "43px" }} src={Rank1Icon} />
                    ) : rankData.ranking === 2 ? (
                      <img style={{ width: "43px" }} src={Rank2Icon} />
                    ) : (
                      <img style={{ width: "43px" }} src={Rank3Icon} />
                    )}
                    <span className={styles.Ranker}>
                      {rankData.nickname.map((name) => (
                        <span key={name}>{name}</span>
                      ))}
                    </span>
                  </div>
                ))}
                <img
                  className={styles.TotalRankNav}
                  src={ArrowRight}
                  onClick={handleNavigateToTotalRank}
                />
              </div>
            )}
          <div className={styles.ContentWrapper}>
            {detailInfo.friends.length !== 0 && (
              <div className={styles.FriendSectionWrapper}>
                <span className={styles.FriendTitle}>
                  {detailInfo.name}에 있는 친구
                </span>
                <div className={styles.FriendContainerWrapper}>
                  {detailInfo.friends.map((friend) => (
                    <div
                      key={friend.nickname}
                      className={styles.FriendContainer}
                    >
                      <img
                        className={styles.FriendProfileImg}
                        src={friend.profileUrl ?? DefaultProfileImg}
                        alt={friend.nickname}
                      />
                      <span className={styles.FriendNickname}>
                        {friend.nickname}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              className={`${styles.InfoWrapper} ${
                isExpandedFocusedSheet ? styles.InfoWrapperOpen : ""
              }`}
            >
              <span className={styles.InfoTitle}>정보</span>
              <span
                className={`${styles.InfoContent} ${
                  !isExpandedFocusedSheet ? styles.InfoContentClamp : ""
                }`}
              >
                {detailInfo.content}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FocusedLocationInfo;
