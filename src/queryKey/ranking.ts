export const RANKING_QUERY_KEY = {
  USER: ["user-ranking"],
  FRIEND: (friendId: string) => ["friend-ranking", friendId],
  LOCATION_DEFAULT: ["location-total-ranks"],
  LOCATION_TOP3: (placeId: number) => ["location-total-ranks", "top3", placeId],
  LOCATION_TOTAL: (placeId: number) => [
    "location-total-ranks",
    "total",
    placeId,
  ],
  LOCATION_USER: (placeId: number) => ["location-total-ranks", "me", placeId],
} as const;
