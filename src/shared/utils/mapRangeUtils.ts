// 건국대 범위 사각형으로 지정
const schoolRange = [
  [127.0707, 37.5399],
  [127.0742, 37.5472],
  [127.0843, 37.5445],
  [127.0819, 37.537],
];

// 각 좌표(4개) 안에 있는지 검증하는 로직
export function isPointInSchool(
  userLng: number,
  userLat: number,
  schoolRange: number[][],
) {
  let inside = false;
  for (let i = 0, j = schoolRange.length - 1; i < schoolRange.length; j = i++) {
    const xi = schoolRange[i][0],
      yi = schoolRange[i][1];
    const xj = schoolRange[j][0],
      yj = schoolRange[j][1];

    const intersect =
      yi > userLat !== yj > userLat &&
      userLng < ((xj - xi) * (userLat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

let errorShown = false;
// 내 위치를 추적하여 학교 내부인지 검증하는 로직
export function isMyLocationInSchool(setIsInSchool: (value: boolean) => void) {
  if (!navigator.geolocation) return;

  // watchPosition으로 이동할 때마다 검증
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const inside = isPointInSchool(longitude, latitude, schoolRange);
      setIsInSchool(inside); // 밖으로 나가면 false 처리됨
    },
    (err) => {
      if (!errorShown) {
        console.warn("위치 정보를 가져올 수 없습니다.", err);
        errorShown = true;
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    },
  );

  return () => {
    navigator.geolocation.clearWatch(watchId); // 컴포넌트 unmount 시 정리
  };
}
