import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getBookmarks, removeBookmark } from "@apis/bookmark";
import { transformBookmarkToNotice } from "@pages/Notice/Bookmark/utils/bookmarkTransform";
import { BOOKMARK_QUERY_KEY } from "@/queryKey";
import useToast from "@hooks/use-toast";

// 북마크 목록 조회
export const useBookmarksQuery = () => {
  const toast = useToast();

  const query = useQuery({
    queryKey: BOOKMARK_QUERY_KEY.LIST,
    queryFn: async () => {
      const apiData = await getBookmarks();
      return transformBookmarkToNotice(apiData);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("북마크 데이터를 불러오는데 실패했습니다.");
    }
  }, [query.isError, toast]);

  return query;
};

// 북마크 삭제 (북마크 목록 페이지에서 사용)
export const useRemoveBookmarkMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: removeBookmarkItem } = useMutation({
    mutationFn: (bookmarkId: number) => removeBookmark(bookmarkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKMARK_QUERY_KEY.LIST });
    },
    onError: () => {
      toast.error("북마크 삭제에 실패했습니다.");
    },
  });

  return { removeBookmarkItem };
};
