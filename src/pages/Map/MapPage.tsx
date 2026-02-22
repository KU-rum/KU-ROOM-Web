// 지도 페이지
import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

import {
  MarkerData,
  MapSearchResult,
  PlaceData,
  CategoryEnum,
} from "@apis/types";
import { getCategoryLocationsApi } from "@apis/map";
import DefaultProfileImg from "@assets/defaultProfileImg.svg";
import BottomBar from "@components/BottomBar/BottomBar";
import ShareLocationModal from "@components/ShareLocationModal/ShareLocationModal";
import { isMyLocationInSchool } from "@utils/mapRangeUtils";
import { useCheckShareStatusQuery } from "@/queries";

import styles from "./MapPage.module.css";
import MapSearchBar from "./components/MapSearchBar/MapSearchBar";
import MapCategoryChip from "./components/MapCategoryChip/MapCategoryChip";
import KuroomMap from "./components/KuroomMap";
import MapSearch from "./components/MapSearch/MapSearch";
import LocationsBottomSheet from "./components/LocationsBottomSheet/LocationsBottomSheet";
import FocusedLocationBottomSheet from "./components/FocusedLocationBottomSheet/FocusedLocationBottomSheet";

import {
  clearAllMarkers,
  makeFocusMarker,
  makeMarkerIcon,
  renderedMarkers,
  renderMarkers,
  resetFocusedMarker,
} from "./utils/kuroomMapUtils";
import SearchResultHeader from "./components/MapSearch/SearchResultHeader";
import { MapLayoutContext } from "./layout/MapLayout";
import { getCategoryEnum } from "./utils/category-chip";
import LocationTrackingButton from "./components/LocationTrackingButton/LocationTrackingButton";
import LocationShareButton from "./components/LocationShareButton/LocationShareButton";
import { CATEGORY_CHIPS } from "./constant/MapData";

const INCLUDE_BOTTOM_SHEET_LIST: string[] = CATEGORY_CHIPS.filter(
  (chip) => chip.title !== "친구",
).map((chip) => chip.title);

// TODO: 전체 랭킹 페이지에서 돌아왔을 때 마커 포커스 및 해당 마커를 가운데로 정렬하는 기능 추가 필요

const MapPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    // ================== 상태 ==================
    isTracking,
    visibleBottomSheet,
    isExpandedSheet,
    hasFocusedMarker,
    isExpandedFocusedSheet,
    selectedCategoryLocations,
    detailLocationData,
    searchMode,
    isInSchool,
    ableToShare,
    selectedCategoryTitle,
    selectedCategoryEnum,
    modalState,
    markers,
    markerFlag,
    mapInstanceRef,

    setIsTracking,
    setVisibleBottomSheet,
    setIsExpandedSheet,
    setHasFocusedMarker,
    setIsExpandedFocusedSheet,
    setSelectedCategoryLocations,
    setDetailLocationData,
    setSearchMode,
    setIsInSchool,
    setSelectedCategoryTitle,
    setSelectedCategoryEnum,
    setModalState,
    setMarkers,
    setMarkerFlag,
  } = useOutletContext<MapLayoutContext>();

  const { isSharedLocation, isPendingShareStatus, isErrorShareStatus } =
    useCheckShareStatusQuery();

  // 서버로부터 데이터 fetching ***********************************************

  // 친구 제외 카테고리 칩을 눌렀을 때 서버에 카테고리 ENUM 을 이용하여 요청
  const getCategoryLocations = async (selectedCategory: CategoryEnum) => {
    if (!selectedCategory) return;
    try {
      const locations = await getCategoryLocationsApi(selectedCategory);
      setSelectedCategoryLocations(locations);
    } catch (error) {
      console.error(error);
      alert("서버 상태 또는 네트워크에 문제가 있습니다.");
    }
  };

  // 이벤트 핸들러 함수 *******************************************************
  const resetSelectSearch = () => {
    setSearchMode(false);
    setDetailLocationData(null);
    setSelectedCategoryTitle("");
    setSelectedCategoryEnum("");
    setMarkerFlag(0);
    setMarkers([]);
    setIsExpandedSheet(false);
    setVisibleBottomSheet(false);
    setHasFocusedMarker(false);
    setVisibleBottomSheet(false);
    setIsExpandedFocusedSheet(false);
    clearAllMarkers();
    navigate(location.pathname);
  };

  const onClickGoBackButton = () => {
    if (isExpandedSheet) {
      setIsExpandedSheet(false);
      setIsExpandedFocusedSheet(false);
    } else if (hasFocusedMarker && selectedCategoryLocations) {
      setIsTracking(false);
      resetFocusedMarker(setHasFocusedMarker);
      setDetailLocationData(null);
    } else {
      resetSelectSearch();
    }
  };

  // 위치 공유 관련
  const handleShareLocation = () => {
    if (isSharedLocation) {
      setModalState(true);
    } else {
      navigate("/share-location");
    }
  };

  // 시트에서 위치 클릭 시 이동하는 로직
  const clickToLocationMarker = (location: PlaceData) => {
    if (!isExpandedSheet) return;
    // 다음 frame에 마커 포커스하기
    const target = renderedMarkers.find(
      ({ marker }) => marker.getTitle() === location.name,
    );
    if (target && mapInstanceRef.current) {
      setHasFocusedMarker(true);
      makeFocusMarker(
        location.placeId,
        mapInstanceRef.current,
        target.marker,
        setIsTracking,
        setHasFocusedMarker,
        setDetailLocationData,
      );
    }

    setIsExpandedSheet(false); // 바텀시트 내리기
  };

  // 카테고리 칩 선택 핸들러
  const handleSelectCategoryChip = (title: string) => {
    setSelectedCategoryTitle(title);
    const name = getCategoryEnum(title);
    if (!name) {
      return console.error("잘못된 칩 클릭");
    }
    setSelectedCategoryEnum(name);
    setIsTracking(false);
  };

  // 검색 결과를 클릭 시에 마커 찍기
  const clickSearchResultToMarker = (searchResult: MapSearchResult) => {
    setSelectedCategoryLocations([]);
    setSelectedCategoryTitle(searchResult.name);
    const markerIcon = makeMarkerIcon("default");
    if (
      mapInstanceRef.current &&
      setIsTracking &&
      setHasFocusedMarker &&
      setDetailLocationData
    ) {
      renderMarkers(
        mapInstanceRef.current,
        [
          {
            placeId: searchResult.placeId,
            markerIcon: markerIcon,
            name: searchResult.name,
            latitude: searchResult.latitude,
            longitude: searchResult.longitude,
          },
        ],
        searchResult.name,
        setIsTracking,
        setHasFocusedMarker,
        setDetailLocationData,
      );
    }
  };
  // 컴포넌트 초기화 로직 ***********************************************
  useEffect(() => {
    setSearchMode(state?.isSearchMode ?? false);
    if (state?.isFriendChip) {
      handleSelectCategoryChip("친구");
    }

    // 현재 내 위치가 학교 내부인지 검증
    return isMyLocationInSchool(setIsInSchool);
  }, []);

  useEffect(() => {
    if (!detailLocationData) {
      setMarkers([]);
      return;
    }
    setVisibleBottomSheet(true);
    setHasFocusedMarker(true);
    // 마커 아이콘 반영
    const markerIcon = makeMarkerIcon("default");
    setMarkers([
      {
        placeId: detailLocationData.placeId,
        markerIcon: markerIcon,
        name: detailLocationData.name,
        latitude: detailLocationData.latitude,
        longitude: detailLocationData.longitude,
      },
    ]);
  }, [detailLocationData]);

  useEffect(() => {
    if (
      detailLocationData &&
      renderedMarkers.length > 0 &&
      mapInstanceRef.current
    ) {
      const target = renderedMarkers.find(
        ({ marker }) => marker.getTitle() === detailLocationData.name,
      );
      if (target) {
        makeFocusMarker(
          detailLocationData.placeId,
          mapInstanceRef.current,
          target.marker,
          setIsTracking,
          setHasFocusedMarker,
          setDetailLocationData,
        );
      }
    }
  }, [renderedMarkers]);

  useEffect(() => {
    if (!selectedCategoryTitle) {
      setMarkers([]);
      setVisibleBottomSheet(false);
      return;
    }

    getCategoryLocations(selectedCategoryEnum);
    if (selectedCategoryTitle !== "친구") {
      setVisibleBottomSheet(true);
    }
  }, [selectedCategoryEnum]);

  useEffect(() => {
    if (selectedCategoryLocations.length === 0) return;
    if (selectedCategoryTitle === "친구") {
      const placeMarkers: MarkerData[] = selectedCategoryLocations.map(
        (item) => ({
          placeId: item.placeId,
          markerIcon: item.friends[0]?.profileUrl || DefaultProfileImg,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          isFriendMarker: true,
          numOfFriends: item.friends.length,
        }),
      );
      setMarkers(placeMarkers);
      setMarkerFlag((prev) => prev + 1);
    } else {
      const markerIcon = makeMarkerIcon(selectedCategoryTitle);
      const placeMarkers: MarkerData[] = selectedCategoryLocations.map(
        (item) => ({
          placeId: item.placeId,
          markerIcon,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
        }),
      );
      setMarkers(placeMarkers);
      setMarkerFlag((prev) => prev + 1);
    }
  }, [selectedCategoryLocations]);

  return (
    <div>
      <KuroomMap
        height={
          INCLUDE_BOTTOM_SHEET_LIST.includes(selectedCategoryTitle) ||
          selectedCategoryTitle === ""
            ? "calc(100vh - 92px)"
            : "100vh"
        }
        markers={markers}
        markerFlag={markerFlag}
        mapRefProp={mapInstanceRef}
        isTracking={isTracking}
        selectedCategoryTitle={selectedCategoryTitle}
        setIsTracking={setIsTracking}
        setHasFocusedMarker={setHasFocusedMarker}
        setDetailLocationData={setDetailLocationData}
      />

      {/* 검색 모드일 때 MapSearch만 덮어씌우기 */}
      {searchMode ? (
        // 검색 모드 전체 화면
        <div className={styles.FullScreenOverlay}>
          <MapSearch
            setSearchMode={setSearchMode}
            clickSearchResultToMarker={clickSearchResultToMarker}
          />
        </div>
      ) : (
        // 검색 결과가 있을 때 상단 바, 바텀시트, (2개 이상일 때 목록보기) 보여주기
        <>
          {hasFocusedMarker || selectedCategoryTitle ? (
            !hasFocusedMarker ? (
              <SearchResultHeader
                selectedCategoryTitle={selectedCategoryTitle}
                resetSelectSearch={resetSelectSearch}
                onClickGoBackButton={onClickGoBackButton}
              />
            ) : (
              detailLocationData && (
                <SearchResultHeader
                  detailLocationData={detailLocationData}
                  resetSelectSearch={resetSelectSearch}
                  onClickGoBackButton={onClickGoBackButton}
                />
              )
            )
          ) : (
            // 검색 결과 없을 때만 기본 UI 보여주기
            <>
              <button
                className={styles.SearchBarContainer}
                onClick={() => {
                  setIsTracking(false);
                  setSearchMode(true);
                }}
              >
                <MapSearchBar />
              </button>
              <MapCategoryChip
                handleSelectCategoryChip={handleSelectCategoryChip}
              />
              <LocationTrackingButton
                isTracking={isTracking}
                handleTrackingLocation={() => setIsTracking(true)}
              />
              <LocationShareButton
                isSharedLocation={isSharedLocation}
                isPendingShareStatus={isPendingShareStatus}
                isErrorShareStatus={isErrorShareStatus}
                isInSchool={isInSchool}
                handleShareLocation={handleShareLocation}
              />
            </>
          )}
        </>
      )}
      {(INCLUDE_BOTTOM_SHEET_LIST.includes(selectedCategoryTitle) ||
        selectedCategoryTitle === "") && (
        <>
          <LocationsBottomSheet
            visibleBottomSheet={visibleBottomSheet}
            selectedCategoryLocations={selectedCategoryLocations}
            isExpandedSheet={isExpandedSheet}
            hasFocusedMarker={hasFocusedMarker}
            setIsExpandedSheet={setIsExpandedSheet}
            clickToLocationMarker={clickToLocationMarker}
          />
          <BottomBar />
        </>
      )}
      <FocusedLocationBottomSheet
        hasFocusedMarker={hasFocusedMarker}
        isExpandedFocusedSheet={isExpandedFocusedSheet}
        setHasFocusedMarker={setHasFocusedMarker}
        setIsExpandedFocusedSheet={setIsExpandedFocusedSheet}
        detailLocationData={detailLocationData}
      />
      <ShareLocationModal
        modalState={modalState}
        isSharedLocation={isSharedLocation}
        ableToShare={ableToShare}
        setModalState={setModalState}
      />
    </div>
  );
};

export default MapPage;
