export { useFriendListQuery, useEditFriendMutation } from "./friend";

export {
  useSearchedUserListQuery,
  useSentRequestListQuery,
  useReceivedRequestListQuery,
  useFriendRequestMutation,
  useRespondToRequestMutation,
} from "./user-list";

export {
  useUserProfileQuery,
  useChangeNicknameMutation,
  useChangePwMutation,
  useUserDepartmentMutation,
  useProfileImageMutation,
} from "./profile";

export {
  useCollegesQuery,
  useCollegeDepartmentsQuery,
  useSearchedDepartmentQuery,
} from "./department";

export {
  useUserSharingRankingQuery,
  useFriendSharingRankingQuery,
  useLocationTop3RankQuery,
  useLocationTotalRankQuery,
} from "./ranking";

export {
  useAlarmListQuery,
  useCheckAlarmMutation,
  useUnreadAlarmQuery,
  useAlarmSettingsQuery,
  useAlarmSettingsMutation,
} from "./alarm";
