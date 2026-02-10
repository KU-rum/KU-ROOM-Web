export const USER_LIST_QUERY_KEY = {
  ALL: ["users"],
  REQUEST: () => [...USER_LIST_QUERY_KEY.ALL, "request"],
  RECEIVED: () => [...USER_LIST_QUERY_KEY.ALL, "received"],
  SEARCHED_USER: (nickname: string) => [...USER_LIST_QUERY_KEY.ALL, nickname],
};
