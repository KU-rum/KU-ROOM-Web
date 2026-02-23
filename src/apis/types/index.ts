export interface ApiResponse {
  code: number;
  status: string;
  message: string;
}

export type {
  DepartmentType,
  GetCollegesDepartmentsResponse,
  SearchedDepartmentsResponse,
} from "./department";

export type { GetUserFriendListResponse } from "./friend";

export type {
  UserProfileResponseData,
  UserProfileResponse,
  CheckNicknameResponse,
  ChangeProfileResponse,
  ChangePwBeforeLoginRequest,
  ChangePwAfterLoginRequest,
  GetProfileImagePresignedUrlData,
  GetProfileImagePresignedUrlResponse,
} from "./profile";

export type {
  RankListType,
  LocationTop3RankResponse,
  LocationTotalRankType,
  RankingResponse,
  LocationTop3RankType,
  LocationTotalRankResponseData,
  LocationTotalRankResponse,
  LocationMyRankResponse,
} from "./ranking";

export type {
  SearchedUserData,
  SearchedUserListResponse,
  FriendRequestReceivedData,
  GetFriendRequestReceivedListResponse,
} from "./user-list";

export {
  AlarmType,
  AlarmCategory,
  type AlarmContentType,
  type AlarmDataType,
  type AlarmListResponseData,
  type AlarmListResponse,
  type CheckAlarmRequest,
  type CheckAlarmResponseData,
  type CheckAlarmResponse,
  type AlarmReadStatusResponseData,
  type AlarmReadStatusResponse,
  type GetAlarmActiveStatusResponse,
  type UpdateAlarmActiveStatusResponse,
} from "./alarm";

export type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  WithdrawResponse,
  ReissueResponse,
  CreateSocialUserRequest,
  SendEmailResponse,
  SignupRequest,
  SignupResponse,
  FindIdResponse,
  CheckIdResponse,
  CheckEmailResponse,
  VerifyCodeResponse,
} from "./auth";

export type {
  Coordinate,
  MarkerData,
  CategoryEnum,
  ShareStatusData,
  ShareStatusResponse,
  PlaceNameData,
  PlaceNameResponse,
  PlaceData,
  CategoryLocationsResponse,
  DetailPlaceData,
  LocationDetailResponse,
  MapSearchResult,
  MapSearchResultResponse,
  MapRecentSearchData,
  MapRecentSearchResponse,
} from "./map";
