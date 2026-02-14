import { PROFILE_QUERY_KEY } from "@/queryKey/profile";

export const NOTICE_QUERY_KEY = {
  OTHERS: [...PROFILE_QUERY_KEY.DEFAULT, "departments"],
} as const;
