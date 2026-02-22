import { getLocationDetailDataApi } from "@apis/map";

import myMarkerIcon from "@assets/map/mylocationMarker.svg";
import focusedMarkerIcon from "@assets/map/focusedMarker.png";
import collegeMarker from "@assets/map/markers/collegeMarker.svg";
import buildingMarker from "@assets/map/markers/buildingMarker.svg";
import kcubekhubMarker from "@assets/map/markers/kcubekhubMarker.svg";
import storeMarker from "@assets/map/markers/storeMarker.svg";
import cafeMarker from "@assets/map/markers/cafeMarker.svg";
import copyRoomMarker from "@assets/map/markers/copyRoomMarker.svg";
import restaurantMarker from "@assets/map/markers/restaurantMarker.svg";
import dormitoryMarker from "@assets/map/markers/dormitoryMarker.svg";
import bankMarker from "@assets/map/markers/bankMarker.svg";
import postMarker from "@assets/map/markers/postMarker.svg";
import defaultMarker from "@assets/map/defaultMarkerIcon.svg";
import { MarkerData, DetailPlaceData } from "@apis/types";

interface KuroomMarker {
  marker: naver.maps.Marker;
  originalIcon: string;
  isFriendMarker?: boolean;
  numOfFriends?: number;
}

let renderedMarkers: KuroomMarker[] = []; // 전역 배열로 기존 마커 저장
let focusedMarker: naver.maps.Marker | null = null;
let isDraggingMap = false;

export { renderedMarkers, focusedMarker, makeFocusMarker };

export const makeMarkerIcon = (category: string): string => {
  switch (category) {
    case "단과대":
      return collegeMarker;
    case "건물":
      return buildingMarker;
    case "K-Cube":
    case "K-Hub":
      return kcubekhubMarker;
    case "편의점":
      return storeMarker;
    case "카페":
      return cafeMarker;
    case "복사실":
      return copyRoomMarker;
    case "학생식당":
      return restaurantMarker;
    case "기숙사":
      return dormitoryMarker;
    case "은행":
      return bankMarker;
    case "우체국":
      return postMarker;
  }
  return defaultMarker;
};

export function renderMarkers(
  map: naver.maps.Map,
  markers: MarkerData[],
  selectedCategoryTitle: string,
  setIsTracking: (value: boolean) => void,
  setHasFocusedMarker: (value: boolean) => void,
  setDetailLocationData: (value: DetailPlaceData) => void,
): void {
  // 기존 마커 제거
  renderedMarkers.forEach(({ marker }) => marker.setMap(null));
  renderedMarkers = [];

  // 마커가 변경될 때마다 건대 중심을 center로 변경하고 줌도 16으로 되게 설정.
  const defaultCenter = new window.naver.maps.LatLng(37.5423, 127.0765);
  map.setCenter(defaultCenter);
  map.setZoom(16);

  markers.forEach(
    ({
      markerIcon,
      placeId,
      name: title,
      latitude,
      longitude,
      isFriendMarker,
      numOfFriends,
    }) => {
      const position = new window.naver.maps.LatLng(latitude, longitude);

      const markerOptions: naver.maps.MarkerOptions = {
        position,
        map,
        title,
      };

      if (isFriendMarker && numOfFriends !== undefined) {
        markerOptions.icon = {
          content: `
          <div style="
            position: relative;
            width: 50px;
            height: 50px;
            border: 3px solid #fff;
            border-radius: 999px;
            box-shadow: 0 0 4px rgba(0,0,0,0.25);
          ">
            <img src="${markerIcon}" alt="friend" style="width: 100%; height: 100%; object-fit: cover; border-radius: 999px;" />
            <div style="
              position: absolute; top: -10px; right: -10px; display: flex; 
              width: 25px; height: 25px; justify-content: center;
              align-items: center; border-radius: 50px; border: 3px solid #FFF; background: #F2FAF5; color: #009733; font-size: 14px; font-weight: 700;
            ">${numOfFriends}</div>
          </div>
        `,
          anchor: new naver.maps.Point(20, 20),
        };
      } else {
        markerOptions.icon = {
          url: markerIcon,
        };
      }

      const marker = new window.naver.maps.Marker(markerOptions);
      (marker as any).placeId = placeId;

      window.naver.maps.Event.addListener(marker, "click", () => {
        makeFocusMarker(
          placeId,
          map,
          marker,
          setIsTracking,
          setHasFocusedMarker,
          setDetailLocationData,
          isFriendMarker,
        );
      });

      setIsTracking(false);
      renderedMarkers.push({
        marker,
        originalIcon: markerIcon,
        isFriendMarker,
        numOfFriends,
      });
    },
  );

  // 마커가 하나뿐일 경우 자동 포커스 처리
  if (renderedMarkers.length === 1 && selectedCategoryTitle !== "친구") {
    // 강제로 delay를 주어 렌더링이 보장된 후 중심 이동되게 함.
    setTimeout(() => {
      makeFocusMarker(
        markers[0].placeId,
        map,
        renderedMarkers[0].marker,
        setIsTracking,
        setHasFocusedMarker,
        setDetailLocationData,
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
    if (!isDraggingMap) {
      resetFocusedMarker(setHasFocusedMarker);
    }
  });
}

// 특정 마커 포커스
async function makeFocusMarker(
  placeId: number,
  map: naver.maps.Map,
  marker: naver.maps.Marker,
  setIsTracking: (value: boolean) => void,
  setHasFocusedMarker: (value: boolean) => void,
  setDetailLocationData: (value: DetailPlaceData) => void,
  isFriendMarker?: boolean,
) {
  const position = marker.getPosition() as naver.maps.LatLng;
  // 위치를 아래로 조금 내리기 위해 위도를 조정
  const adjustedPosition = new naver.maps.LatLng(
    position.lat() - 0.001,
    position.lng(),
  );

  map.setCenter(adjustedPosition);
  map.setZoom(17);
  setIsTracking(false);

  try {
    const response = await getLocationDetailDataApi(placeId);
    setDetailLocationData(response.data);
  } catch (error) {
    console.error("디테일 위치 정보 가져오기 mapUtils에서 오류 : ", error);
  }

  focusedMarker = marker; // 현재 포커스 마커 기억
  setHasFocusedMarker(true); // 포커스 되었음을 알림

  // HTMLIcon으로 스타일링 + 라벨링. 텍스트 스트로크 넣기
  marker.setIcon({
    content: `
    <div style="display: flex; flex-direction: column; align-items: center; margin-top:-25px; z-index:10000">
      <img src="${focusedMarkerIcon}" width="80" height="80" />
      <span style="
        padding: 5px 7px;
        border-radius: 5px;
        background: white;
        box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
        margin-top: -4px;
        color: #000;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        white-space: nowrap;
        word-break: keep-all;         
        overflow-wrap: normal;   
        text-align: center;
      ">
        ${marker.getTitle()}
      </span>
    </div>
  `,
    anchor: isFriendMarker
      ? new naver.maps.Point(42, 45)
      : new naver.maps.Point(15, 45),
  });

  marker.setZIndex(1000);

  renderedMarkers.forEach(
    ({ marker: m, originalIcon, isFriendMarker, numOfFriends }) => {
      if (m !== marker) {
        if (isFriendMarker) {
          m.setIcon({
            content: `
            <div style="
              position: relative;
              width: 50px;
              height: 50px;
              border: 3px solid #fff;
              border-radius: 50px;
              box-shadow: 0 0 4px rgba(0,0,0,0.25);
            ">
              <img src="${originalIcon}" alt="friend" style="width: 100%; height: 100%; object-fit: cover; border-radius: 999px;" />
              <div style="
                position: absolute; top: -10px; right: -10px; display: flex; 
                width: 25px; height: 25px; justify-content: center;
                align-items: center; border-radius: 50px; border: 3px solid #FFF; background: #F2FAF5; color: #009733; font-size: 14px; font-weight: 700;
              ">${numOfFriends ?? ""}</div>
            </div>
           `,
            anchor: new naver.maps.Point(20, 20),
          });
        } else {
          m.setIcon({ url: originalIcon });
        }
      }
    },
  );
}

// 포커스된 마커 원래 상태로 되돌리는 함수
export function resetFocusedMarker(
  setHasFocusedMarker: (value: boolean) => void,
) {
  if (focusedMarker) {
    const target = renderedMarkers.find(
      ({ marker }) => marker === focusedMarker,
    );
    if (target) {
      if (target.isFriendMarker) {
        focusedMarker.setIcon({
          content: `
            <div style="
              position: relative;
              width: 50px;
              height: 50px;
              border: 3px solid #fff;
              border-radius: 50px;
              box-shadow: 0 0 4px rgba(0,0,0,0.25);
              z-index: 500;
            ">
              <img src="${target.originalIcon}" alt="friend" style="width: 100%; height: 100%; object-fit: cover; border-radius: 999px;" />
              <div style="
                position: absolute; top: -10px; right: -10px; display: flex; 
                width: 25px; height: 25px; justify-content: center;
                align-items: center; border-radius: 50px; border: 3px solid #FFF; background: #F2FAF5; color: #009733; font-size: 14px; font-weight: 700;
              ">${target.numOfFriends ?? ""}</div>
            </div>
          `,
          anchor: new naver.maps.Point(20, 20),
        });
      } else {
        focusedMarker.setIcon({ url: target.originalIcon });
      }
    }

    focusedMarker = null;
    setHasFocusedMarker(false);
  }
}

// 현재 위치 정보 가져와서 내 위치 마커 추가 및 watchPosition으로 따라가는 로직
export function myLocationTracking(
  map: naver.maps.Map,
  setCurrentLatLng: any,
  markerRef: React.MutableRefObject<any>,
  isTrackingRef: React.MutableRefObject<boolean>,
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
          name: "내 위치",
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
      timeout: 10000, // 타임아웃 10초
    },
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
  isTrackingRef: React.MutableRefObject<boolean>,
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

export function clearAllMarkers() {
  renderedMarkers.forEach(({ marker }) => marker.setMap(null));
  renderedMarkers = [];
  focusedMarker = null;
}
