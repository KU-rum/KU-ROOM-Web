// 좌표
export interface Coordinate {
  latitude: number;
  longitude: number;
}

// 마커에 필요한 정보
export interface MarkerData extends Coordinate {
  placeId: number;
  markerIcon: string;
  name: string;
  isFriendMarker?: boolean;
  numOfFriends?: number;
}
