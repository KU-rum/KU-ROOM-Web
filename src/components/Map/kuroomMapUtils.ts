import myMarkerIcon from "../../assets/map/mylocationMarker.svg";
import focusedMarkerIcon from "../../assets/map/focusedMarker.png";

// 마커 렌더링 로직
interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  icon: string;
}

interface KuroomMarker {
  marker: naver.maps.Marker;
  originalIcon: string;
}

let renderedMarkers: KuroomMarker[] = []; // 전역 배열로 기존 마커 저장
let focusedMarker: naver.maps.Marker | null = null;
let isDraggingMap = false;

export { renderedMarkers, makeFocusMarker };

export function renderMarkers(
  map: naver.maps.Map,
  markers: MarkerData[],
  setIsTracking: (value: boolean) => void,
  setHasFocusedMarker?: (value: boolean) => void,
  setFocusedMarkerTitle?: (value: string | null) => void
): void {
  // 기존 마커 제거
  renderedMarkers.forEach(({ marker }) => marker.setMap(null));
  renderedMarkers = [];

  // 마커가 변경될 때마다 건대 중심을 center로 변경하고 줌도 16으로 되게 설정.
  const defaultCenter = new window.naver.maps.LatLng(37.5423, 127.0768);
  map.setCenter(defaultCenter);
  map.setZoom(16);

  markers.forEach(({ lat, lng, title, icon }) => {
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map,
      title,
      icon: {
        // 마커 아이콘 추가
        url: icon,
      },
    });
    window.naver.maps.Event.addListener(marker, "click", () => {
      makeFocusMarker(
        map,
        marker,
        setIsTracking,
        setHasFocusedMarker,
        setFocusedMarkerTitle
      );
    });

    setIsTracking(false);
    renderedMarkers.push({ marker, originalIcon: icon });
  });

  // 마커가 하나뿐일 경우 자동 포커스 처리
  if (renderedMarkers.length === 1) {
    // 강제로 delay를 주어 렌더링이 보장된 후 중심 이동되게 함.
    setTimeout(() => {
      makeFocusMarker(
        map,
        renderedMarkers[0].marker,
        setIsTracking,
        setHasFocusedMarker,
        setFocusedMarkerTitle
      );
    }, 10);
  }

  // 지도 드래그 상태 관리
  window.naver.maps.Event.addListener(map, "dragstart", () => {
    isDraggingMap = true;
  });

  window.naver.maps.Event.addListener(map, "dragend", () => {
    // 드래그가 끝난 후엔 false로 되돌림 (단, 포커스는 유지)
    isDraggingMap = false;
  });

  // 지도 클릭 시 포커스 해제 (단, 드래그 아닌 경우에만)
  window.naver.maps.Event.addListener(map, "click", () => {
    if (!isDraggingMap && focusedMarker) {
      const target = renderedMarkers.find(
        ({ marker }) => marker === focusedMarker
      );
      if (target) {
        focusedMarker.setIcon({ url: target.originalIcon }); // ← 여기 수정
      }
      focusedMarker = null;
      setHasFocusedMarker?.(false);
      setFocusedMarkerTitle?.(null);
    }
  });
}

// 특정 마커 포커스
function makeFocusMarker(
  map: naver.maps.Map,
  marker: naver.maps.Marker,
  setIsTracking: (value: boolean) => void,
  setHasFocusedMarker?: (value: boolean) => void,
  setFocusedMarkerTitle?: (value: string) => void
) {
  const position = marker.getPosition();

  map.setCenter(position);
  map.setZoom(17);
  setIsTracking(false);

  focusedMarker = marker; // 현재 포커스 마커 기억
  setHasFocusedMarker?.(true); // 포커스 되었음을 알림
  setFocusedMarkerTitle?.(marker.getTitle());

  // HTMLIcon으로 스타일링 + 라벨링. 텍스트 스트로크 넣기
  marker.setIcon({
    content: `
    <div style="display: flex; flex-direction: column; align-items: center; margin-top:-25px">
      <img src="${focusedMarkerIcon}" width="80" height="80" />
      <span style="
        margin-top: -4px;
        color: #000;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        text-shadow:
          -2px -2px 0 white,
          2px -2px 0 white,
          -2px  2px 0 white,
          2px  2px 0 white;
        white-space: normal;
        word-break: keep-all;         
        overflow-wrap: break-word;   
        text-align: center;
      ">
        ${marker.getTitle()}
      </span>
    </div>
  `,
    anchor: new naver.maps.Point(15, 150), // 가운데 정렬
  });

  marker.setZIndex(1000);

  renderedMarkers.forEach(({ marker: m, originalIcon }) => {
    if (m !== marker) {
      m.setIcon({ url: originalIcon }); // ← 여기 수정
    }
  });
}
// 현재 위치 정보 가져와서 마커 추가 및 watchPosition으로 따라가는 로직
export function myLocationTracking(
  map: naver.maps.Map,
  setCurrentLatLng: any,
  markerRef: React.MutableRefObject<any>,
  isTrackingRef: React.MutableRefObject<boolean>
) {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const currentLocation = new window.naver.maps.LatLng(latitude, longitude);

      setCurrentLatLng(currentLocation); // 현재 위치 상태 업데이트

      if (markerRef.current) {
        // 기존 마커 위치 업데이트
        markerRef.current.setPosition(currentLocation);
      } else {
        // 최초 마커 생성
        markerRef.current = new window.naver.maps.Marker({
          position: currentLocation,
          map,
          title: "내 위치",
          icon: {
            // 내 위치 마커 아이콘 추가
            url: myMarkerIcon,
          },
        });
      }
      markerRef.current.setMap(map);

      if (isTrackingRef.current) {
        // 지도 중심을 내 위치를 기준으로 이동
        map.setCenter(currentLocation);
      }
    },
    (error) => {
      console.error("위치 정보를 가져올 수 없습니다:", error);

      if (error.code === 1) {
        alert("위치 권한이 거부되었습니다.");
      } else if (error.code === 2) {
        alert("위치 정보를 사용할 수 없습니다.");
      } else if (error.code === 3) {
        alert("위치 정보를 가져오는 데 시간이 초과되었습니다.");
      }
    },
    {
      enableHighAccuracy: true, // 정확도 향상
      maximumAge: 100, // 캐시 X
      timeout: 10000, // 타임아웃 5초
    }
  );

  // 언마운트 시 추적 종료
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

// 내 위치 추적 상태일 때 지도 조작 시 위치 추적 비활성화하는 로직
export function noTracking(
  map: naver.maps.Map,
  setIsTracking: (value: boolean) => void,
  isTrackingRef: React.MutableRefObject<boolean>
) {
  const disableTracking = () => {
    setIsTracking(false);
    isTrackingRef.current = false;
  };

  // 드래그
  window.naver.maps.Event.addListener(map, "drag", disableTracking);

  // 줌 변경 (줌 버튼, 휠, 핀치 줌 포함)
  window.naver.maps.Event.addListener(map, "zoom_changed", disableTracking);

  // 더블 클릭 줌
  window.naver.maps.Event.addListener(map, "dblclick", disableTracking);

  // 마우스 휠
  window.naver.maps.Event.addListener(map, "wheel", disableTracking);
}
