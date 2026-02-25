import { ApiResponse } from ".";

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

// 위치 공유한 친구 정보
interface FriendData {
  nickname: string;
  profileUrl: string | null;
}

export interface ShareStatusData {
  isActive: boolean;
  placeName: string | null;
}

export interface ShareStatusResponse extends ApiResponse {
  data: ShareStatusData;
}

export interface PlaceNameData {
  placeName: string;
}

export interface PlaceNameResponse extends ApiResponse {
  data?: PlaceNameData;
}

// 장소 정보
export interface PlaceData extends Coordinate {
  placeId: number;
  name: string;
  subName: string;
  content: string;
  friends: FriendData[];
}

export interface CategoryLocationsResponse extends ApiResponse {
  data: PlaceData[];
}

export interface DetailPlaceData extends PlaceData {
  imageUrls: string[];
}

export interface LocationDetailResponse extends ApiResponse {
  data: DetailPlaceData;
}

export interface MapSearchResult extends Coordinate {
  name: string;
  placeId: number;
}

export interface MapSearchResultResponse extends ApiResponse {
  data: MapSearchResult[];
}

export interface MapRecentSearchData {
  name: string;
  placeHistoryId: number;
}

export interface MapRecentSearchResponse extends ApiResponse {
  data: MapRecentSearchData[];
}
