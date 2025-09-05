import type { NoticeResponse } from "@apis/notice";

export interface NoticePageProps {
  className?: string;
}

export interface NoticeState {
  notices: NoticeResponse[];
  loading: boolean;
  activeTab: string;
}

export interface TabIndicatorStyle {
  left: number;
  width: number;
}

export interface NoticePageConfig {
  tabs: readonly string[];
  defaultTab: string;
}