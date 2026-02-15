import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Header from "@/shared/components/Header/Header";
import KuroomMap from "@pages/Map/components/KuroomMap";
import sharePin from "@assets/map/share-pin.png";
import { Coordinate } from "@/shared/types";
import { getUserShareLocation } from "@apis/map";

import styles from "./ShareLocation.module.css";
import Button from "@/shared/components/Button/Button";
import ShareLocationModal from "@/shared/components/ShareLocationModal/ShareLocationModal";
import { isMyLocationInSchool } from "@/shared/utils/mapRangeUtils";

const ShareLocation = () => {
  const navigate = useNavigate();
  const [isInSchool, setIsInSchool] = useState(false);

  const [center, setCenter] = useState<Coordinate>();
  const [placeName, setPlaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState(false);

  const handleOpenShareModal = () => {
    setModalState(true);
  };

  const getBuildingToShare = useCallback(async () => {
    if (!center) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await getUserShareLocation(
        center.latitude,
        center.longitude,
      );
      if (response.code === 1204) {
        setPlaceName("");
        return;
      }
      setPlaceName(response.data.placeName);
    } catch (error) {
      setPlaceName("");
      console.error("위치 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [center]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      getBuildingToShare();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [center, getBuildingToShare]);

  useEffect(() => {
    // 현재 내 위치가 학교 내부인지 검증
    return isMyLocationInSchool(setIsInSchool);
  }, []);

  return (
    <div className={styles.PageWrapper}>
      <Header>내 위치 공유</Header>
      <KuroomMap
        height="100dvh"
        isTracking={true}
        handleCenterChanged={setCenter}
      />
      <div className={styles.SharePinWrapper}>
        <div className={styles.SharePinText}>
          {placeName === "" ? "현재 위치한 건물 위로 움직여주세요" : placeName}
        </div>
        <img
          className={styles.SharePinIcon}
          src={sharePin}
          alt="공유용 위치핀"
        />
      </div>
      {placeName !== "" && (
        <div className={styles.BottomSheetWrapper}>
          {isLoading ? (
            <div className={styles.LoaderContainer}>
              <BeatLoader color="#009733" size={18} margin={4} />
            </div>
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
        nearLocation={placeName}
        setModalState={setModalState}
        refreshSharedStatus={() => navigate(-1)}
      />
    </div>
  );
};

export default ShareLocation;
