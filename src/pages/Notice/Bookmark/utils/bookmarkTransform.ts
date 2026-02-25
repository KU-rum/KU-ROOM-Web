import type { BookmarkResponse, NoticeResponse } from "@apis/notice";

export const transformBookmarkToNotice = (apiData: BookmarkResponse[] | undefined): NoticeResponse[] => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((item) => ({
    id: item.noticeId,
    categoryId: 0,
    categoryName: "",
    title: item.noticeName,
    link: "",
    content: "",
    pubDate: item.noticePubDate,
    author: "",
    description: "",
    isBookMarked: true,
    bookmarkId: item.bookmarkId,
  }));
};