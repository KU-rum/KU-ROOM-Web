// 지도 페이지
import { useEffect, useState } from "react";
import BottomBar from "../../components/BottomBar/BottomBar";
import styles from "./MapPage.module.css";
import Map from "../../components/Map/Map";

const MapPage = () => {
  const [isTracking, setIsTracking] = useState(true); // 내 현재 위치를 따라가는지 상태

  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    console.log(searchLocation);
  }, [searchLocation]);

  const buttonClassName = `${styles.TrackingButton} ${
    isTracking ? styles.TrackingButtonActive : ""
  }`;

  return (
    <div>
      {/* 위치 추적 버튼 예시 */}
      <button className={buttonClassName} onClick={() => setIsTracking(true)}>
        현재 위치 따라가기
      </button>
      <div className={styles.LocationSearchWrapper}>
        <input
          className={styles.LocationSearchBar}
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="건물명을 입력하세요"
        />
      </div>
      <Map
        height="calc(100vh - 92px)"
        isTracking={isTracking}
        setIsTracking={setIsTracking}
        searchLocation={searchLocation}
      />
      <BottomBar />
    </div>
  );
};

export default MapPage;
