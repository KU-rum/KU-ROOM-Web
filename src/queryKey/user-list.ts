export const USER_LIST_QUERY_KEY = {
  DEFAULT: ["users"],
  REQUEST: () => [...USER_LIST_QUERY_KEY.DEFAULT, "request"],
  RECEIVED: () => [...USER_LIST_QUERY_KEY.DEFAULT, "received"],
  SEARCHED_USER: (nickname: string) => [
    ...USER_LIST_QUERY_KEY.DEFAULT,
    nickname,
  ],
};
