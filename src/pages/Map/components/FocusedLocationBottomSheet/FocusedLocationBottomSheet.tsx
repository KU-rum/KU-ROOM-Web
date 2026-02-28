import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [loadedImageUrls, setLoadedImageUrls] = useState<Set<string>>(
    new Set(),
  );

  const hasImages = !!detailLocationData?.imageUrls?.length;

  const handleCloseImageDetail = () => {
    setIsImageDetailMode(false);
  };

  const handleOpenSelectImageIndex = (index?: number) => {
    if (index) setClickedIndex(index);
    else setClickedIndex(0);
    setIsImageDetailMode(true);
  };

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImageUrls((prev) => {
      if (prev.has(imageUrl)) return prev;

      const next = new Set(prev);
      next.add(imageUrl);
      return next;
    });
  }, []);

  // 서버에 해당 장소 정보 요청
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.scrollTop = 0;
    }
  }, [detailLocationData]);

  useEffect(() => {
    setLoadedImageUrls(new Set());
  }, [detailLocationData?.placeId]);

  useEffect(() => {
    if (!detailLocationData?.imageUrls?.length) return;

    const preloadImages = detailLocationData.imageUrls.map((placeImage) => {
      const image = new Image();
      image.src = placeImage;

      if (image.complete && image.naturalWidth > 0) {
        handleImageLoad(placeImage);
      } else {
        image.onload = () => handleImageLoad(placeImage);
        image.onerror = () => handleImageLoad(placeImage);
      }

      return image;
    });

    return () => {
      preloadImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [detailLocationData?.imageUrls, handleImageLoad]);

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
            {!isExpandedFocusedSheet && hasImages && (
              <>
                <div className={styles.SheetImgWrapper}>
                  {/* 최대 3개까지만 보이도록 */}
                  {detailLocationData?.imageUrls
                    .slice(0, 3)
                    .map((imageUrl, index) => {
                      const isLoaded = loadedImageUrls.has(imageUrl);
                      return (
                        <div key={index} className={styles.SheetImgContainer}>
                          {!isLoaded && (
                            <div className={styles.ImageSkeleton} />
                          )}
                          <img
                            className={`${styles.SheetImg} ${
                              isLoaded
                                ? styles.SheetImgVisible
                                : styles.SheetImgHidden
                            }`}
                            src={imageUrl}
                            alt={`위치 관련 이미지-${index}`}
                            onLoad={() => handleImageLoad(imageUrl)}
                            onError={() => handleImageLoad(imageUrl)}
                          />
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FocusedLocationBottomSheet;
