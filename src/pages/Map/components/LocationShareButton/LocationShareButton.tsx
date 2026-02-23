import ShareLocationIcon from "@assets/map/shareLocation.svg";
import UnshareLocationIcon from "@assets/map/shareLocationWhite.svg";

import styles from "./LocationShareButton.module.css";

interface LocationShareButtonProps {
  isSharedLocation?: boolean;
  isPendingShareStatus?: boolean;
  isErrorShareStatus?: boolean;
  isInSchool: boolean;
  handleShareLocation: () => void;
}

export default function LocationShareButton({
  isSharedLocation,
  isPendingShareStatus,
  isErrorShareStatus,
  isInSchool,
  handleShareLocation,
}: LocationShareButtonProps) {
  if (isPendingShareStatus || isErrorShareStatus)
    return (
      <button className={styles.ShareLocationButton} disabled={true}>
        <span className={styles.DisabledToShareText}>위치 공유 불가</span>
      </button>
    );

  return isSharedLocation ? (
    <button
      className={styles.UnshareLocationButton}
      onClick={handleShareLocation}
    >
      <img src={UnshareLocationIcon} alt="위치 공유 해제 아이콘" />
      <span>내 위치 공유 중</span>
    </button>
  ) : (
    isInSchool && (
      <button
        className={styles.ShareLocationButton}
        onClick={handleShareLocation}
      >
        <img src={ShareLocationIcon} alt="위치 공유 아이콘" />
        <span>내 위치 공유</span>
      </button>
    )
  );
}
