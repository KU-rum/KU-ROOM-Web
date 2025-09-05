import type { NoticeResponse } from "@apis/notice";

export interface NoticeDetailPageProps {
  className?: string;
}

export interface NoticeDetailState {
  notice: NoticeResponse | null;
  loading: boolean;
  error: string | null;
}

export interface FormattedParagraph {
  type: 'section' | 'subtitle' | 'paragraph' | 'list' | 'notice' | 'special' | 'bullet' | 'dash-list' | 'line-break';
  content: string;
  key: string;
}