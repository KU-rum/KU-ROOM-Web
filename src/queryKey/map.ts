import { Coordinate } from "@/apis/types";

export const MAP_QUERY_KEY = {
  USER_SHARE_STATUS: ["user-share-status"],
  PLACE_NAME: (coord?: Coordinate) => ["place-name", coord],
} as const;
