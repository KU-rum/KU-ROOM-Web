import { ApiResponse } from ".";

// 공지사항 개별 항목
export interface NoticeResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  link: string;
  content: string;
  pubDate: string;
  author: string;
  description: string;
  isBookMarked: boolean;
  bookmarkId?: number;
}

// 페이징 관련 타입
export interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// 공지사항 목록 응답 (Spring Page 구조)
export interface NoticeListResponse {
  content: NoticeResponse[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}

// 공지사항 목록 조회 파라미터
export interface NoticeListParams {
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

// 공지사항 상세 데이터
export interface NoticeDetailData {
  id: number;
  content: string;
  link: string;
  title: string;
  pubdate: string;
  isBookmark: boolean;
  bookmarkId?: number;
}

export interface NoticeDetailApiResponse extends ApiResponse {
  data: NoticeDetailData;
}

// 인기/주요 공지사항 응답
export interface NoticeListApiResponse extends ApiResponse {
  data: NoticeResponse[];
}

// 기타 탭 학과 링크
export interface DepartmentUrlData {
  name: string;
  url: string;
}

export interface NoticeOthersResponse extends ApiResponse {
  data: DepartmentUrlData[];
}
