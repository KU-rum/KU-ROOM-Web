import { useEffect, useRef, useState } from "react";

import { Coordinate, MarkerData, DetailPlaceData } from "@apis/types";

import {
  myLocationTracking,
  noTracking,
  renderMarkers,
} from "../utils/kuroomMapUtils";

interface MapProps {
  width?: string;
  height?: string;
  markers?: MarkerData[];
  markerFlag?: number;
  mapRefProp?: React.MutableRefObject<naver.maps.Map | null>;
  isTracking?: boolean;
  selectedCategoryTitle?: string;
  setIsTracking?: (value: boolean) => void;
  draggable?: boolean;
  zoomable?: boolean;
  setHasFocusedMarker?: (value: boolean) => void;
  setDetailLocationData?: (value: DetailPlaceData | null) => void;
  handleCenterChanged?: (coord: Coordinate) => void;
}

// React Strict Mode로 인해 두번 마운트 되어서 하단 왼쪽 로고 두개로 보이는데
// 배포 시에는 안 그러니 걱정 안해도됨

const KuroomMap = ({
  width = "100%",
  height = "100%",
  markers,
  markerFlag,
  mapRefProp,
  isTracking = false,
  selectedCategoryTitle,
  setIsTracking,
  draggable = true,
  zoomable = true,
  setHasFocusedMarker,
  setDetailLocationData,
  handleCenterChanged,
}: MapProps) => {
  // 로컬 상태 ***************************************************************
  const mapRef = useRef(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null); // 지도 객체를 저장할 ref
  const [currentLatLng, setCurrentLatLng] = useState<any>(null); // 현재 위치를 기억
  const isTrackingRef = useRef(false); // 추적 상태 최신값을 유지할 ref

  // 컴포넌트 초기화 로직 ***********************************************
  useEffect(() => {
    if (!window.naver) return;

    const mapOptions = {
      center: new naver.maps.LatLng(37.5423, 127.0765), // 건국대학교 중심
      zoom: 17,
      draggable: draggable,
      scrollWheel: zoomable,
      pinchZoom: zoomable,
      disableDoubleTapZoom: !zoomable,
      disableDoubleClickZoom: !zoomable,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstance.current = map; // 지도 인스턴스를 ref에 저장

    if (mapRefProp) {
      mapRefProp.current = map; // 외부 지도 ref에 전달
    }

    // 화면 조작 시 위치 추적 비활성화
    if (setIsTracking) noTracking(map, setIsTracking, isTrackingRef);

    // 현재 위치 정보 가져와서 마커 추가 및 watchPosition으로 따라가기
    if (navigator.geolocation) {
      // 초기 위치 먼저 빠르게 잡기. watchPosition은 최초 위치 가져올 때 시간이 걸릴 수 있음.
      if (isTracking) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const current = new window.naver.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            );
            setCurrentLatLng(current); // 상태 업데이트
            map.setCenter(current); // 지도 중심 이동
            if (setIsTracking) setIsTracking(true);
          },
          (err) => console.warn("초기 위치 가져오기 실패", err),
          {
            enableHighAccuracy: true,
            timeout: 10000,
          },
        );
      }

      const cleanup = myLocationTracking(
        map,
        setCurrentLatLng,
        markerRef,
        isTrackingRef,
      );

      //  지도 중심이 변경될 때마다 좌표 반환
      if (handleCenterChanged) {
        naver.maps.Event.addListener(map, "center_changed", () => {
          const center = map.getCenter();
          handleCenterChanged({
            latitude: center.lat(),
            longitude: center.lng(),
          });
        });
      }

      return cleanup;
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  // 사이드 이펙트 (useEffect) *********************************************
  // 마커 렌더링. 마커 배열이 변경될 때만 실행되도록
  useEffect(() => {
    if (
      mapInstance.current &&
      setIsTracking &&
      markers &&
      setHasFocusedMarker &&
      setDetailLocationData
    ) {
      renderMarkers(
        mapInstance.current,
        markers,
        selectedCategoryTitle!,
        setIsTracking,
        setHasFocusedMarker,
        setDetailLocationData,
      );
    }
  }, [markerFlag]);

  // 추적 모드 활성화 시 현재 위치 중심으로 지도 이동
  useEffect(() => {
    if (isTracking && currentLatLng && mapInstance.current) {
      mapInstance.current.setCenter(currentLatLng);
    }
  }, [isTracking, currentLatLng]);

  useEffect(() => {
    isTrackingRef.current = isTracking;
  }, [isTracking]);

  return <div ref={mapRef} style={{ width, height, overflow: "hidden" }} />;
};

export default KuroomMap;
