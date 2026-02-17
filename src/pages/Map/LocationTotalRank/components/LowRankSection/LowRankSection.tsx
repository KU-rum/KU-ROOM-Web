import { LocationTotalRankType } from "@apis/types";
import styles from "./LowRankSection.module.css";

interface LowRankSectionProps {
  totalRankData: LocationTotalRankType[];
  listBottomRef: (node?: Element | null | undefined) => void;
}

export default function LowRankSection({
  totalRankData,
  listBottomRef,
}: LowRankSectionProps) {
  return (
    totalRankData && (
      <div className={styles.LowRankWrapper}>
        {totalRankData.map((rankData) => (
          <div
            key={`${rankData.ranking}-${rankData.nickname}`}
            className={styles.LowRanksData}
          >
            <span className={styles.LowRanking}>{rankData.ranking}</span>
            <div className={styles.LowRanksInfo}>
              <span className={styles.RankerName}>{rankData.nickname}</span>
              <span className={styles.SharingCount}>
                {rankData.sharingCount}회
              </span>
            </div>
          </div>
        ))}
        <div
          ref={listBottomRef}
          style={{
            width: "100%",
            height: "1px",
          }}
        />
      </div>
    )
  );
}
