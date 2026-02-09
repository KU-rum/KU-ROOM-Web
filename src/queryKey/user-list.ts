export const USER_LIST_QUERY_KEY = {
  DEFAULT: ["users"],
  SEARCHED_USER: (nickname: string) => [
    ...USER_LIST_QUERY_KEY.DEFAULT,
    nickname,
  ],
};
