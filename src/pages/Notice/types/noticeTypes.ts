export interface NoticeItem {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description: string;
  isBookMarked: boolean;
}

// 북마크 인터페이스 정의
export interface BookmarkItem extends NoticeItem {
  timestamp: string; // 북마크 추가 시간
}
