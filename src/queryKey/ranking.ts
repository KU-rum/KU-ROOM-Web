export const RANKING_QUERY_KEY = {
  USER: ["user-ranking"],
  FRIEND: (friendId: string) => ["friend-ranking", friendId],
};
