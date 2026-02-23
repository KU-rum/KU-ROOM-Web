import React, { useRef, useEffect } from "react";

import { PlaceData } from "@apis/types";
import useBottomSheetDrag from "@pages/Map/hooks/useBottomSheetDrag";
import DefaultProfileImg from "@assets/defaultProfileImg.svg";
import mapListIcon from "@assets/map/mapListIcon.svg";

import styles from "./LocationsBottomSheet.module.css";

interface LocationsBottomSheetProps {
  visibleBottomSheet: boolean;
  selectedCategoryLocations: PlaceData[];
  isExpandedSheet: boolean;
  hasFocusedMarker: boolean;
  setIsExpandedSheet: (value: boolean) => void;
  clickBottomSheetToLocationMarker: (value: PlaceData) => void;
}

const LocationsBottomSheet: React.FC<LocationsBottomSheetProps> = ({
  visibleBottomSheet,
  selectedCategoryLocations,
  isExpandedSheet,
  hasFocusedMarker,
  setIsExpandedSheet,
  clickBottomSheetToLocationMarker,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // 카테고리가 변경될 때 스크롤 리셋
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.scrollTop = 0;
    }
  }, [selectedCategoryLocations]);

  // 바텀 시트 올리고 내리는 로직. 좀 더 연구 필요할듯.
  useBottomSheetDrag({
    sheetRef,
    isExpanded: isExpandedSheet,
    setIsExpanded: setIsExpandedSheet,
    minHeight: 150,
  });

  return (
    <div
      className={`${styles.LocationInfoBottomSheetContainer} ${visibleBottomSheet && !hasFocusedMarker ? styles.open : ""}`}
    >
      {!isExpandedSheet && (
        <button
          className={styles.ListButton}
          onClick={() => setIsExpandedSheet(true)}
        >
          <img src={mapListIcon} alt="목록보기" />
          <span className={styles.ListButtonText}>목록보기</span>
        </button>
      )}

      <div
        ref={sheetRef}
        className={`${styles.LocationInfoBottomSheet} ${
          isExpandedSheet ? styles.Expanded : ""
        }`}
        style={{
          transform: isExpandedSheet
            ? "translateY(0)"
            : "translateY(calc(100% - 150px))",
          background: "#fff",
        }}
      >
        <div className={styles.SheetIndicator} />
        {selectedCategoryLocations.map((info) => (
          <button
            key={info.placeId}
            className={styles.LocationInfoWrapper}
            style={isExpandedSheet ? {} : { pointerEvents: "none" }}
            onClick={() => clickBottomSheetToLocationMarker(info)}
          >
            <div className={styles.TitleWrapper}>
              <span className={styles.TitleText}>{info.name}</span>
              <span className={styles.SubTitleText}>{info.subName}</span>
            </div>
            <div className={styles.ContentWrapper}>
              {info.friends.length !== 0 && (
                <div className={styles.FriendSectionWrapper}>
                  <span className={styles.FriendTitle}>친구</span>
                  <div className={styles.FriendContainerWrapper}>
                    {info.friends.map((friend) => (
                      <div
                        key={friend.nickname}
                        className={styles.FriendContainer}
                      >
                        <img
                          className={styles.FriendProfileImg}
                          src={friend.profileUrl ?? DefaultProfileImg}
                          alt={friend.nickname}
                        />
                        <span className={styles.FriendNickname}>
                          {friend.nickname}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.InfoWrapper}>
                <span className={styles.InfoTitle}>정보</span>
                <span className={styles.InfoContent}>{info.content}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {!isExpandedSheet && <div className={styles.BottomSheetGrad} />}
    </div>
  );
};

export default LocationsBottomSheet;
