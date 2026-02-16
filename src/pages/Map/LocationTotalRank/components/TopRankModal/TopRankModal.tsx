import ReactModal from "react-modal";

import Rank1Icon from "@assets/icon/ranking/rank1.png";
import Rank2Icon from "@assets/icon/ranking/rank2.png";
import Rank3Icon from "@assets/icon/ranking/rank3.png";
import Button from "@components/Button/Button";
import { LocationTop3RankType } from "@/shared/types";

import styles from "./TopRankModal.module.css";

interface TopRankModalProps {
  modalState: boolean;
  placeName?: string;
  rankData?: LocationTop3RankType;
  handleCloseModal: () => void;
}

export default function TopRankModal({
  modalState,
  placeName,
  rankData,
  handleCloseModal,
}: TopRankModalProps) {
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
    <ReactModal
      isOpen={modalState}
      className={styles.RankModalContainer}
      overlayClassName={styles.Overlay}
      ariaHideApp={false}
    >
      {rankData && (
        <>
          <img
            className={styles.RankIcon}
            src={rankIcon(rankData?.ranking)}
            alt="등수 아이콘"
          />
          <div className={styles.RankInfo}>
            <span className={styles.PlaceName}>{placeName}</span>
            <span className={styles.SharingCount}>
              {rankData.sharingCount}회
            </span>
          </div>
          <div className={styles.RankersWrapper}>
            {rankData.nickname.map((ranker) => (
              <span key={ranker} className={styles.RankerName}>
                {ranker}
              </span>
            ))}
          </div>
          <Button onClick={handleCloseModal}>확인</Button>
        </>
      )}
    </ReactModal>
  );
}
