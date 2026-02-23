import { CategoryEnum, Coordinate } from "@apis/types";

export const MAP_QUERY_KEY = {
  USER_SHARE_STATUS: ["user-share-status"],
  PLACE_NAME: (coord?: Coordinate) => ["place-name", coord],
  SEARCH_RESULT: (searchText: string) => ["map-search", searchText],
  RECENT_SEARCH: ["map-recent-search"],
  CATEGORY_LOCATIONS: (category: CategoryEnum) => [
    "category-locations",
    category,
  ],
  LOCATION_DETAIL: (placeId?: number) => ["location-detail", placeId],
} as const;
