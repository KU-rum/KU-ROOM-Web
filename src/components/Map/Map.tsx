import { useEffect, useRef, useState } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  onClick?: () => void;
}

interface MapProps {
  width?: string;
  height?: string;
  isTracking?: boolean;
  setIsTracking?: (value: boolean) => void;
  draggable?: boolean;
  zoomable?: boolean;
  searchLocation?: string;
}

// React Strict Mode로 인해 두번 마운트 되어서 하단 왼쪽 로고 두개로 보이는데
// 배포 시에는 안 그러니 걱정 안해도됨

const Map = ({
  width = "100%",
  height = "100%",
  isTracking,
  setIsTracking,
  draggable = true,
  zoomable = true,
  searchLocation,
}: MapProps) => {
  const mapRef = useRef(null);
  const markerRef = useRef<any>(null);
  const mapInstance = useRef<any>(null); // 지도 객체를 저장할 ref
  const [currentLatLng, setCurrentLatLng] = useState<any>(null); // 현재 위치를 기억
  const isTrackingRef = useRef(true); // 추적 상태 최신값을 유지할 ref

  const [markers] = useState<MarkerData[]>([
    {
      lat: 37.5419,
      lng: 127.078,
      title: "제1학생회관",
      onClick: () => console.log("제1학생회관 정보"),
    },
    {
      lat: 37.5421,
      lng: 127.0739,
      title: "건국대학교 도서관",
      onClick: () => console.log("건국대학교 도서관 정보"),
    },
  ]);

  useEffect(() => {
    if (!window.naver) return;

    const mapOptions = {
      zoom: 16,
      draggable,
      scrollWheel: zoomable,
      pinchZoom: zoomable,
      disableDoubleTapZoom: !zoomable,
      disableDoubleClickZoom: !zoomable,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstance.current = map;

    if (setIsTracking) {
      window.naver.maps.Event.addListener(map, "drag", () => {
        setIsTracking(false);
      });
    }

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = new window.naver.maps.LatLng(
            latitude,
            longitude
          );

          setCurrentLatLng(currentLocation);

          if (markerRef.current) {
            markerRef.current.setPosition(currentLocation);
          } else {
            markerRef.current = new window.naver.maps.Marker({
              position: currentLocation,
              map,
              title: "내 위치",
            });
          }

          if (isTrackingRef.current) {
            map.setCenter(currentLocation);
          }
        },
        console.error,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // 2. searchLocation 바뀔 때 마커 다시 렌더링
  useEffect(() => {
    if (!mapInstance.current || !window.naver) return;

    // 이전 검색 마커 제거
    const currentMarkers = mapInstance.current.searchMarkers || [];
    currentMarkers.forEach((marker: any) => marker.setMap(null));

    if (!searchLocation || searchLocation.trim() === "") {
      mapInstance.current.searchMarkers = [];
      return;
    }

    const matchedMarkers = markers
      .filter((m) => m.title.includes(searchLocation)) // 부분 일치 허용
      .map(({ lat, lng, title, onClick }) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: mapInstance.current,
          title,
        });

        if (onClick) {
          window.naver.maps.Event.addListener(marker, "click", onClick);
        }

        // ✅ 검색된 마커 기준으로 지도 중심 이동
        mapInstance.current.setCenter(marker.getPosition());

        return marker;
      });

    mapInstance.current.searchMarkers = matchedMarkers;
  }, [searchLocation]);

  // 추적 모드 활성화 시 현재 위치 중심으로 지도 이동
  useEffect(() => {
    if (isTracking && currentLatLng && mapInstance.current) {
      mapInstance.current.setCenter(currentLatLng);
    }
  }, [isTracking]);

  // 추적 상태 변경 시 ref도 업데이트
  useEffect(() => {
    if (isTracking) {
      isTrackingRef.current = isTracking;
    }
  }, [isTracking]);

  return <div ref={mapRef} style={{ width, height, overflow: "hidden" }} />;
};

export default Map;
