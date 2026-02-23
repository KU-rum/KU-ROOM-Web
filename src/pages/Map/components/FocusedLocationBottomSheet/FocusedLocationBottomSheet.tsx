import React, { useEffect, useRef, useState } from "react";

import useBottomSheetDrag from "@pages/Map/hooks/useBottomSheetDrag";
import { DetailPlaceData } from "@apis/types";

import styles from "./FocusedLocationBottomSheet.module.css";
import LocationInfoTopContent from "./LocationInfoTopContent/LocationInfoTopContent";
import FocusedLocationInfo from "./FocusedLocationInfo/FocusedLocationInfo";
import ImageDetails from "./ImageDetails/ImageDetails";

interface FocusedLocationBottomSheetProps {
  hasFocusedMarker: boolean;
  isExpandedFocusedSheet: boolean;
  setHasFocusedMarker: (value: boolean) => void;
  setIsExpandedFocusedSheet: (value: boolean) => void;
  detailLocationData: DetailPlaceData | null;
}

const FocusedLocationBottomSheet: React.FC<FocusedLocationBottomSheetProps> = ({
  hasFocusedMarker,
  isExpandedFocusedSheet,
  setHasFocusedMarker,
  setIsExpandedFocusedSheet,
  detailLocationData,
}) => {
  // 위치 상세 정보 저장할 상태
  const sheetRef = useRef<HTMLDivElement>(null);

  // 사진 자세히 보기 상태
  const [isImageDetailMode, setIsImageDetailMode] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);

  const handleCloseImageDetail = () => {
    setIsImageDetailMode(false);
  };

  const handleOpenSelectImageIndex = (index?: number) => {
    if (index) setClickedIndex(index);
    else setClickedIndex(0);
    setIsImageDetailMode(true);
  };

  // 서버에 해당 장소 정보 요청
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.scrollTop = 0;
    }
  }, [detailLocationData]);

  // 바텀 시트 올리고 내리는 로직.
  useBottomSheetDrag({
    sheetRef,
    isExpanded: isExpandedFocusedSheet,
    hasFocusedMarker: hasFocusedMarker,
    setIsExpanded: setIsExpandedFocusedSheet,
    setHasFocusedMarker: setHasFocusedMarker,
    minHeight: 450,
    disabled: isImageDetailMode,
  });

  return (
    <div
      className={`${styles.DetailInfoBottomSheetContainer} ${hasFocusedMarker ? styles.open : ""}`}
    >
      <div
        ref={sheetRef}
        className={`${styles.DetailInfoBottomSheet} ${
          isExpandedFocusedSheet ? styles.Expanded : ""
        }`}
        style={{
          transform: isExpandedFocusedSheet
            ? "translateY(0)"
            : "translateY(calc(100% - 450px))",
        }}
      >
        {isImageDetailMode && detailLocationData?.imageUrls ? (
          <ImageDetails
            clickedIndex={clickedIndex}
            imageUrls={detailLocationData?.imageUrls}
            handleCloseImageDetail={handleCloseImageDetail}
          />
        ) : (
          <>
            <div className={styles.SheetIndicator} />
            {isExpandedFocusedSheet && (
              <LocationInfoTopContent
                locationImages={detailLocationData?.imageUrls}
                setIsExpandedFocusedSheet={setIsExpandedFocusedSheet}
                handleSelectImageIndex={handleOpenSelectImageIndex}
              />
            )}
            {detailLocationData && (
              <FocusedLocationInfo
                detailInfo={detailLocationData}
                isExpandedFocusedSheet={isExpandedFocusedSheet}
                setIsExpandedFocusedSheet={setIsExpandedFocusedSheet}
              />
            )}
            {!isExpandedFocusedSheet && (
              <div className={styles.SheetImgContainer}>
                {/* 최대 3개까지만 보이도록 */}
                {detailLocationData?.imageUrls
                  .slice(0, 3)
                  .map((item, index) => (
                    <img
                      className={styles.SheetImg}
                      key={index}
                      src={item}
                      alt="위치 관련 이미지"
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FocusedLocationBottomSheet;
