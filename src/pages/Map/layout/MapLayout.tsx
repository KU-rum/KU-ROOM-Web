import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";

import {
  Coordinate,
  MarkerData,
  CategoryEnum,
  DetailPlaceData,
  PlaceData,
} from "@apis/types";

export interface MapLayoutContext {
  /** 내 현재 위치를 따라가는지 상태 */
  isTracking: boolean;
  /** 검색 또는 칩 클릭 시 바텀 시트 표시 여부 */
  visibleBottomSheet: boolean;
  /** 바텀 시트 확장 여부 */
  isExpandedSheet: boolean;
  /** 포커스된 마커가 있을 때 바텀시트 표시 여부 */
  hasFocusedMarker: boolean;
  /** 포커스된 마커 바텀시트 확장 여부 */
  isExpandedFocusedSheet: boolean;
  /** 선택된 카테고리의 위치 배열 */
  selectedCategoryLocations: PlaceData[];
  /** 상세 위치 데이터 */
  detailLocationData: DetailPlaceData | null;
  /** 검색 모드 상태 */
  searchMode: boolean;
  /** 현재 위치가 학교 내부인지 여부 */
  isInSchool: boolean;
  // 위치 공유 가능한지 상태
  ableToShare: boolean;
  /** 내 위치 공유 상태 */
  isSharedLocation: boolean;
  /** 위치 공유 상태 갱신 트리거 키 */
  locationSharedRefreshKey: number;
  /** 선택된 카테고리 이름 */
  selectedCategoryTitle: string;
  /** 선택된 카테고리 ENUM 값 */
  selectedCategoryEnum: CategoryEnum;
  /** 위치 공유 모달 상태 */
  modalState: boolean;
  /** 현재 좌표 */
  currentLocation: Coordinate | null;
  /** 가장 가까운 위치 타이틀 */
  nearLocation: string;
  /** 지도에 찍힌 마커들 */
  markers: MarkerData[];
  /** 마커 렌더링 트리거 */
  markerFlag: number;
  /** 네이버 지도 인스턴스 Ref */
  mapInstanceRef: React.MutableRefObject<naver.maps.Map | null>;

  setIsTracking: React.Dispatch<React.SetStateAction<boolean>>;
  setVisibleBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExpandedSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setHasFocusedMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExpandedFocusedSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCategoryLocations: React.Dispatch<
    React.SetStateAction<PlaceData[]>
  >;
  setDetailLocationData: React.Dispatch<
    React.SetStateAction<DetailPlaceData | null>
  >;
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInSchool: React.Dispatch<React.SetStateAction<boolean>>;
  setAbleToShare: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSharedLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationSharedRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  setSelectedCategoryTitle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategoryEnum: React.Dispatch<React.SetStateAction<string>>;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentLocation: React.Dispatch<React.SetStateAction<Coordinate | null>>;
  setNearLocation: React.Dispatch<React.SetStateAction<string>>;
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
  setMarkerFlag: React.Dispatch<React.SetStateAction<number>>;
}

const MapLayout = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [isExpandedSheet, setIsExpandedSheet] = useState(false);
  const [hasFocusedMarker, setHasFocusedMarker] = useState(false);
  const [isExpandedFocusedSheet, setIsExpandedFocusedSheet] = useState(false);
  const [selectedCategoryLocations, setSelectedCategoryLocations] = useState<
    PlaceData[]
  >([]);
  const [detailLocationData, setDetailLocationData] =
    useState<DetailPlaceData | null>(null);

  const [searchMode, setSearchMode] = useState(false);
  const [isInSchool, setIsInSchool] = useState(false);
  const [ableToShare, setAbleToShare] = useState(false);
  const [isSharedLocation, setIsSharedLocation] = useState(false);
  const [locationSharedRefreshKey, setLocationSharedRefreshKey] = useState(0);
  const [selectedCategoryTitle, setSelectedCategoryTitle] =
    useState<string>("");
  const [selectedCategoryEnum, setSelectedCategoryEnum] = useState<
    CategoryEnum | ""
  >("");
  const [modalState, setModalState] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  );
  const [nearLocation, setNearLocation] = useState("");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [markerFlag, setMarkerFlag] = useState<number>(0);

  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  return (
    <Outlet
      context={{
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
        isSharedLocation,
        locationSharedRefreshKey,
        selectedCategoryTitle,
        selectedCategoryEnum,
        modalState,
        currentLocation,
        nearLocation,
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
        setAbleToShare,
        setIsSharedLocation,
        setLocationSharedRefreshKey,
        setSelectedCategoryTitle,
        setSelectedCategoryEnum,
        setModalState,
        setCurrentLocation,
        setNearLocation,
        setMarkers,
        setMarkerFlag,
      }}
    />
  );
};

export default MapLayout;
