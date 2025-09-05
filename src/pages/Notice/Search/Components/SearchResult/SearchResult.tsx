import React from "react";

import searchresultIcon from "@assets/icon/notice/search/searchresult.svg";

import type { NoticeResponse } from "@apis/notice";
import { NoticeList } from "../NoticeList";
import styles from "./SearchResult.module.css";

interface SearchResultProps {
  filteredNotices: NoticeResponse[];
  onItemClick: (noticeId: number) => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({
  filteredNotices,
  onItemClick,
}) => {
  if (filteredNotices.length === 0) {
    return (
      <div className={styles.noResultContainer}>
        <img src={searchresultIcon} alt="검색" className={styles.searchIcon} />
        <div className={styles.noResultText}>검색 결과가 없어요!</div>
      </div>
    );
  }

  return (
    <div className={styles.searchResult}>
      <NoticeList notices={filteredNotices} onItemClick={onItemClick} />
    </div>
  );
};
