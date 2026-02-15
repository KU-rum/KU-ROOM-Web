// 좌표
export interface Coordinate {
  latitude: number;
  longitude: number;
}

// 위치 공유한 친구 정보
interface FriendData {
  nickname: string;
  profileUrl: string | null;
}

//  검색결과에 대한 정보
export interface MapSearchResult extends Coordinate {
  name: string;
  placeId: number;
}

// 최근 검색어 관련 정보
export interface MapRecentSearchData {
  name: string;
  placeHistoryId: number;
}

// 카테고리 ENUM 정보
export type CategoryEnum =
  | "FRIEND"
  | "BUILDING"
  | "COLLEGE"
  | "K_CUBE"
  | "K_HUB"
  | "CONVENIENCE_STORE"
  | "CAFE"
  | "COPY_ROOM"
  | "STUDENT_CAFETERIA"
  | "DORMITORY"
  | "BANK"
  | "POST_OFFICE";

// 장소 정보
export interface PlaceData extends Coordinate {
  placeId: number;
  name: string;
  subName: string;
  content: string;
  friends: FriendData[];
}

// 친구 칩 관련 정보
export interface SharedFriendData {
  nickname: string;
  place: PlaceData[];
}

// 디테일한 장소 정보.
export interface DetailPlaceData extends PlaceData {
  imageUrls: string[];
}

// 마커에 필요한 정보
export interface MarkerData extends Coordinate {
  placeId: number;
  markerIcon: string;
  name: string;
  isFriendMarker?: boolean;
  numOfFriends?: number;
}
