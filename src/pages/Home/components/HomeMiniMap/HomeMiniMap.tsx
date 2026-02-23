import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@components/Button/Button";
import Loading from "@components/Loading/Loading";
import KuroomMap from "@pages/Map/components/KuroomMap";

import styles from "./HomeMiniMap.module.css";
import { isMyLocationInSchool } from "@/shared/utils/mapRangeUtils";

interface HomeMiniMapProps {
  isSharedLocation?: boolean;
  sharedLocationName?: string | null;
  isLoading: boolean;
  isError: boolean;
  setModalState: (value: boolean) => void;
}

const HomeMiniMap: React.FC<HomeMiniMapProps> = ({
  isSharedLocation,
  sharedLocationName,
  isLoading,
  isError,
  setModalState,
}) => {
  const navigate = useNavigate();

  // 학교 내부에 있는지 상태
  const [isInSchool, setIsInSchool] = useState(false);

  useEffect(() => {
    // 현재 내 위치가 학교 내부인지 검증
    return isMyLocationInSchool(setIsInSchool);
  }, []);

  const handleSeeMap = () => {
    navigate("/map");
  };
  const handleToShareLocationPage = () => {
    navigate("/share-location");
  };

  const handleUnshareLocation = () => {
    setModalState(true);
  };

  if (isSharedLocation && sharedLocationName === null) return null;

  const title = isSharedLocation
    ? `현재 ${sharedLocationName}(으)로 공유 중입니다!`
    : isInSchool
      ? "현재 건국대학교에 계신가요?"
      : "현재 건국대학교 밖에 있어요";

  const subtitle = isSharedLocation
    ? "장소를 이동할 땐 위치 공유를 해제해주세요 :)"
    : isInSchool
      ? "내 위치를 친구들에게 공유해보세요!"
      : "학교 내부에서 위치를 공유해주세요!";

  const buttonText = isSharedLocation
    ? "위치 공유 해제하기"
    : "내 위치 공유하기";
  const handleButtonClick = isSharedLocation
    ? handleUnshareLocation
    : handleToShareLocationPage;

  const disabled = !isInSchool && !isSharedLocation;

  // TODO: 추후 스켈레톤 또는 에러 결과 UI 표시
  if (isError) {
    return null;
  }

  return (
    <div className={styles.HomeMiniMapBackground}>
      {isLoading ? (
        <Loading type="section" sectionHeight={398} />
      ) : (
        <div className={styles.HomeMiniMapWrapper}>
          <div className={styles.MiniMapTextContainer}>
            <h1 className={styles.MiniMapBoldText}>{title}</h1>
            <span className={styles.MiniMapNormalText}>{subtitle}</span>
          </div>

          <button className={styles.HomeMiniMap} onClick={handleSeeMap}>
            <KuroomMap
              height="180px"
              isTracking={true}
              draggable={false}
              zoomable={false}
            />
          </button>

          <Button onClick={handleButtonClick} disabled={disabled}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomeMiniMap;
