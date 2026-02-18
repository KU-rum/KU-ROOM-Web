import { LocationTop3RankType } from "@apis/types";
import Rank1Icon from "@assets/icon/ranking/rank1.png";
import Rank2Icon from "@assets/icon/ranking/rank2.png";
import Rank3Icon from "@assets/icon/ranking/rank3.png";

import styles from "./TopRankSection.module.css";

interface TopRankSectionProps {
  top3RankData?: LocationTop3RankType[];
  handleOpenModal: (_rankData: LocationTop3RankType) => void;
}

export default function TopRankSection({
  top3RankData,
  handleOpenModal,
}: TopRankSectionProps) {
  const rankIconBg = (ranking: number) => {
    switch (ranking) {
      case 1:
        return "#F8DDDC";
      case 2:
        return "#DEE9FB";
      case 3:
        return "#FCEED7";
    }
  };
  const rankIcon = (ranking: number) => {
    switch (ranking) {
      case 1:
        return Rank1Icon;
      case 2:
        return Rank2Icon;
      case 3:
        return Rank3Icon;
    }
  };
  return (
    <div className={styles.TopRankWrapper}>
      {top3RankData &&
        top3RankData.map((rankData) => (
          <button
            type="button"
            key={rankData.ranking}
            className={styles.TopRanksData}
            onClick={() => handleOpenModal(rankData)}
          >
            <div
              className={styles.RankIconSection}
              style={{
                backgroundColor: `${rankIconBg(rankData.ranking)}`,
              }}
            >
              <img
                className={styles.RankIcon}
                src={rankIcon(rankData.ranking)}
                alt="등수 아이콘"
              />
            </div>
            <div className={styles.TopRanksInfo}>
              <div className={styles.TopRanksNameWrapper}>
                <span className={styles.TopRankerName}>
                  {rankData.nickname[0]}
                </span>
                {rankData.nickname.length > 1 && (
                  <span className={styles.RestCount}>
                    외 {rankData.nickname.length - 1}명
                  </span>
                )}
              </div>
              <span className={styles.SharingCount}>
                {rankData.sharingCount}회
              </span>
            </div>
          </button>
        ))}
    </div>
  );
}
