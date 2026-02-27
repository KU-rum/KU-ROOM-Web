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
  useCheckIsNicknameDuplicatedMutation,
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

export {
  useSignupMutation,
  useSocialUserSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useWithdrawMutation,
  useGetTokenByTempMutation,
  useCheckIsIdDuplicatedMutation,
  useCheckIsEmailDuplicatedMutation,
  useSendEmailMutation,
  useVerifyCodeMutation,
  useFindIdMutation,
} from "./auth";

export {
  useCheckShareStatusQuery,
  useGetLocationNameQuery,
  useShareUserLocationMutation,
  useMapSearchQuery,
  useMapSearchMutation,
  useCategoryLocationsQuery,
  useLocationDetailQuery,
} from "./map";

export {
  useNoticesInfiniteQuery,
  useNoticeDetailQuery,
  useNoticeBookmarkMutation,
  usePopularNoticesQuery,
  usePrimaryNoticesQuery,
  useNoticeOthersQuery,
  useBookmarksQuery,
  useRemoveBookmarkMutation,
  useSearchNoticesQuery,
  useRecentSearchesQuery,
  useKeywordsQuery,
  useRecentSearchMutation,
  useKeywordMutation,
} from "./notice";

export { useBannersQuery } from "./banner";
