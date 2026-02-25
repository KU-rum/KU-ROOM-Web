import { useEffect, useState } from "react";

import { Coordinate } from "@apis/types";
import { useGetLocationNameQuery } from "@/queries";
import Header from "@components/Header/Header";
import KuroomMap from "@pages/Map/components/KuroomMap";
import sharePin from "@assets/map/share-pin.png";
import Button from "@components/Button/Button";
import ShareLocationModal from "@components/ShareLocationModal/ShareLocationModal";
import { isMyLocationInSchool } from "@utils/mapRangeUtils";
import Loading from "@components/Loading/Loading";

import styles from "./ShareLocation.module.css";

const ShareLocation = () => {
  const [isTracking, setIsTracking] = useState(true);
  const [isInSchool, setIsInSchool] = useState(false);

  const [center, setCenter] = useState<Coordinate>();
  const [modalState, setModalState] = useState(false);

  const { placeName, isLoadingGetLocationName } =
    useGetLocationNameQuery(center);

  const handleOpenShareModal = () => {
    setModalState(true);
  };

  useEffect(() => {
    // 현재 내 위치가 학교 내부인지 검증
    setIsTracking(false);
    return isMyLocationInSchool(setIsInSchool);
  }, []);

  return (
    <div className={styles.PageWrapper}>
      <Header>내 위치 공유</Header>
      <KuroomMap
        height="100dvh"
        isTracking={isTracking}
        handleCenterChanged={setCenter}
      />
      <div className={styles.SharePinWrapper}>
        <div className={styles.SharePinText}>
          {placeName === "" || !placeName
            ? "현재 위치한 건물 위로 움직여주세요"
            : placeName}
        </div>
        <img
          className={styles.SharePinIcon}
          src={sharePin}
          alt="공유용 위치핀"
        />
      </div>
      {placeName && (
        <div className={styles.BottomSheetWrapper}>
          {isLoadingGetLocationName ? (
            <Loading type="section" sectionHeight={100} />
          ) : (
            <div className={styles.BottomSheetContent}>
              <span className={styles.PlaceName}>{placeName}</span>
              <Button onClick={handleOpenShareModal} disabled={!isInSchool}>
                {isInSchool
                  ? "내 위치 공유하기"
                  : "학교 외부에서는 공유할 수 없습니다."}
              </Button>
            </div>
          )}
        </div>
      )}
      <ShareLocationModal
        modalState={modalState}
        isSharedLocation={false}
        ableToShare={true}
        placeName={placeName}
        setModalState={setModalState}
      />
    </div>
  );
};

export default ShareLocation;
