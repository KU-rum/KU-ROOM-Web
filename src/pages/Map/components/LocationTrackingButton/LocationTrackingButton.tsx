import TrackingIcon from "@assets/map/tomylocation.svg";

import styles from "./LocationTrackingButton.module.css";

interface LocationTrackingButtonProps {
  isTracking: boolean;
  handleTrackingLocation: () => void;
}

export default function LocationTrackingButton({
  isTracking,
  handleTrackingLocation,
}: LocationTrackingButtonProps) {
  return (
    <button className={styles.TrackingIcon} onClick={handleTrackingLocation}>
      <img
        src={TrackingIcon}
        alt="위치 추적 아이콘"
        style={{ filter: isTracking ? "none" : "grayscale(100%)" }}
      />
    </button>
  );
}
