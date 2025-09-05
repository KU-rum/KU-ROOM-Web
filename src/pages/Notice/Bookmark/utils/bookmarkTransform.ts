import type { BookmarkResponse, NoticeResponse } from "@apis/notice";

export const transformBookmarkData = (apiData: BookmarkResponse[]): NoticeResponse[] => {
  return apiData.map((item) => ({
    id: item.id,
    categoryId: 0,
    categoryName: "",
    title: item.title,
    link: item.link || "",
    pubDate: item.pubDate,
    author: "",
    description: "",
    isBookMarked: item.bookmarked,
  }));
};