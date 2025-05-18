// 지도 페이지
import { useEffect, useRef, useState } from "react";
import BottomBar from "../../components/BottomBar/BottomBar";
import styles from "./MapPage.module.css";
import myTrackingIcon from "../../assets/map/tomylocation.svg";
import shareLocationIcon from "../../assets/map/shareLocation.svg";
import MapSearchBar from "../../components/Map/MapSearchBar/MapSearchBar";
import MapCategoryChip from "../../components/Map/MapCategoryChip/MapCategoryChip";
import KuroomMap from "../../components/Map/KuroomMap";
import MapSearch from "../../components/Map/MapSearch/MapSearch";
import SearchResultHeader from "../../components/Map/MapSearch/SearchResultHeader";
import LocationsBottomSheet from "../../components/Map/LocationsBottomSheet/LocationsBottomSheet";
import FocusedLocationBottomSheet from "../../components/Map/FocusedLocationBottomSheet/FocusedLocationBottomSheet";
import ShareLocationModal from "../../components/Map/ShareLocationModal/ShareLocationModal";
import { getCategoryLocations } from "../../apis/map";
import { isMyLocationInSchool } from "../../utils/mapRangeUtils";

interface CategoryChip {
  title: string;
  icon: string;
  category: number;
}

interface LocationData {
  userLat: number;
  userLng: number;
}

interface Building {
  id: number | null;
  abbreviation: string;
  name: string;
  number: number;
  latitude: number;
  longitude: number;
}

interface Place {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
  building: Building;
}

const MapPage = () => {
  const [isTracking, setIsTracking] = useState(true); // 내 현재 위치를 따라가는지 상태
  const [searchMode, setSearchMode] = useState(false);
  // 선택된 카테고리 칩 상태
  const [selectedCategory, setSelectedCategory] = useState<CategoryChip | null>(
    null
  );
  // 선택된 카테고리 내의 위치 배열
  const [selectedCategoryLocations, setSelectedCategoryLocations] = useState<
    Place[]
  >([]);
  const [mapSearchResult, setMapSearchResult] = useState("");
  const [isInSchool, setIsInSchool] = useState(false);
  const [isSharedLocation, setIsSharedLocation] = useState(false);

  // 위치 공유 상태
  const [modalState, setModalState] = useState(false);
  const [currenLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  ); // 현재 위치

  const [markers, setMarkers] = useState<Place[]>([]);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  // 검색 또는 칩 클릭 시 바텀 시트
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [isExpandedSheet, setIsExpandedSheet] = useState(false);

  // 클릭 또는 마커가 하나만 있을 때(==마커가 포커스되었을 때) 바텀시트
  const [hasFocusedMarker, setHasFocusedMarker] = useState(false);
  const [isExpandedFocusedSheet, setIsExpandedFocusedSheet] = useState(false);
  const [focusedMarkerTitle, setFocusedMarkerTitle] = useState<string | null>(
    null
  );

  // 칩을 선택했을 때 해당하는 위치 정보들 마커에 저장. 서버에 요청
  useEffect(() => {
    if (selectedCategory) {
      console.log("선택된 카테고리 명: ", selectedCategory.title);
      const fetchCategoryLocations = async () => {
        try {
          const response = await getCategoryLocations(selectedCategory.title);
          console.log(response);
          setSelectedCategoryLocations(response);
        } catch (error) {
          console.error("카테고리 별 위치 정보 가져오기 실패 :", error);
        }
      };

      fetchCategoryLocations();
      setVisibleBottomSheet(true);
    } else {
      setMarkers([]);
      setVisibleBottomSheet(false);
      return;
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (selectedCategoryLocations) {
      setMarkers(selectedCategoryLocations);
    }
  }, [selectedCategoryLocations]);

  // 검색을 했을 때 해당하는 위치 정보 하나 마커에 저장
  // useEffect(() => {
  //   if (!mapSearchResult) {
  //     setMarkers([]);
  //     setVisibleBottomSheet(false);
  //     return;
  //   }
  //   setVisibleBottomSheet(true);
  //   const categoryMatch = KuroomMarkers.find(
  //     (item) => item.category === mapSearchResult
  //   );

  //   if (categoryMatch) {
  //     setMarkers(categoryMatch.markers);
  //   } else {
  //     setMarkers([]); // 해당 카테고리 없으면 빈 배열로
  //   }
  // }, [mapSearchResult]);

  useEffect(() => {
    console.log("현재 포커된 상태: ", hasFocusedMarker);
  }, [hasFocusedMarker]);

  // 현재 위치가 학교 내부 인지 검증. 내 위치도 함께 저장
  // 서버에서 공유 상태인지 받아오기
  useEffect(() => {
    // setIsSharedLocation()
    isMyLocationInSchool(setIsInSchool, setCurrentLocation);
  }, [currenLocation, isSharedLocation]);

  // 위치 공유 모달
  const handleShareLocation = () => {
    setModalState(true);
  };
  return (
    <div>
      {/* KuroomMap은 항상 렌더링되고 */}
      <KuroomMap
        height={mapSearchResult === "친구" ? "100vh" : "calc(100vh - 92px)"}
        markers={markers}
        selectedCategoryTitle={selectedCategory?.title}
        mapRefProp={mapInstanceRef}
        isTracking={isTracking}
        setIsTracking={setIsTracking}
        setHasFocusedMarker={setHasFocusedMarker}
        setFocusedMarkerTitle={setFocusedMarkerTitle}
      />

      {/* 검색 모드일 때 MapSearch만 덮어씌우기 */}
      {searchMode ? (
        // 검색 모드 전체 화면
        <div className={styles.FullScreenOverlay}>
          <MapSearch
            setSearchMode={setSearchMode}
            setMapSearchResult={setMapSearchResult}
          />
        </div>
      ) : (
        // 검색 결과가 있을 때 상단 바, 바텀시트, (2개 이상일 때 목록보기) 보여주기
        <>
          {mapSearchResult || selectedCategory ? (
            <>
              <SearchResultHeader
                selectedCategory={selectedCategory}
                mapSearchResult={mapSearchResult}
                setSearchMode={setSearchMode}
                setSelectedCategory={setSelectedCategory}
                setMapSearchResult={setMapSearchResult}
                setMarkers={setMarkers}
                setIsExpandedSheet={setIsExpandedSheet}
                setHasFocusedMarker={setHasFocusedMarker}
                setIsExpandedFocusedSheet={setIsExpandedFocusedSheet}
              />
            </>
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
              <MapCategoryChip setSelectedCategory={setSelectedCategory} />
              {/* 내 위치 추적 아이콘 */}
              <button
                className={styles.TrackingIcon}
                onClick={() => setIsTracking(true)}
              >
                <img
                  src={myTrackingIcon}
                  alt="위치 추적 아이콘"
                  style={{ filter: isTracking ? "none" : "grayscale(100%)" }}
                />
              </button>
              {/* 학교 내부에서만 보이도록 하기! */}
              {/* 내 위치 공유 버튼 */}
              {isInSchool && (
                <button
                  className={styles.SharedLocationButton}
                  onClick={handleShareLocation}
                >
                  <img src={shareLocationIcon} alt="위치 공유 아이콘" />
                  {isSharedLocation ? (
                    <span className={styles.SharingText}>위치 공유 해제</span>
                  ) : (
                    <span className={styles.SharingText}>내 위치 공유</span>
                  )}
                </button>
              )}
              {/* <button
                className={styles.SharedLocationButton}
                onClick={handleShareLocation}
              >
                <img src={shareLocationIcon} alt="위치 공유 아이콘" />
                {isSharedLocation ? (
                  <span className={styles.SharingText}>위치 공유 해제</span>
                ) : (
                  <span className={styles.SharingText}>내 위치 공유</span>
                )}
              </button> */}
            </>
          )}
        </>
      )}
      {mapSearchResult !== "친구" && (
        <>
          <LocationsBottomSheet
            visibleBottomSheet={visibleBottomSheet}
            mapSearchResult={mapSearchResult}
            isExpandedSheet={isExpandedSheet}
            mapInstance={mapInstanceRef}
            setIsExpandedSheet={setIsExpandedSheet}
            setIsTracking={setIsTracking}
            hasFocusedMarker={hasFocusedMarker}
            setHasFocusedMarker={setHasFocusedMarker}
            setFocusedMarkerTitle={setFocusedMarkerTitle}
          />
          <BottomBar />
        </>
      )}
      <FocusedLocationBottomSheet
        hasFocusedMarker={hasFocusedMarker}
        isExpandedFocusedSheet={isExpandedFocusedSheet}
        setIsExpandedFocusedSheet={setIsExpandedFocusedSheet}
        focusedMarkerTitle={focusedMarkerTitle}
      />
      <ShareLocationModal
        modalState={modalState}
        isSharedLocation={isSharedLocation}
        currentLocation={currenLocation}
        setModalState={setModalState}
        setIsSharedLocation={setIsSharedLocation}
      />
    </div>
  );
};

export default MapPage;
