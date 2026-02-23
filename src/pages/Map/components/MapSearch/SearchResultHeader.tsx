import React from "react";

import arrowBack from "@assets/nav/arrowback.svg";
import deleteIcon from "@assets/icon/deleteIcon.svg";
import { MapSearchResult } from "@apis/types";

import styles from "./SearchResultHeader.module.css";

interface SearchResultProps {
  detailLocationData?: MapSearchResult;
  selectedCategoryTitle?: string;
  resetSelectSearch: () => void;
  onClickGoBackButton: () => void;
}

const SearchResultHeader: React.FC<SearchResultProps> = ({
  detailLocationData,
  selectedCategoryTitle,
  resetSelectSearch,
  onClickGoBackButton,
}) => {
  return (
    <header className={styles.SearchResultContainer}>
      <div className={styles.LeftContentWrapper}>
        <img
          className={styles.ArrowIcon}
          src={arrowBack}
          alt="뒤로 가기"
          onClick={onClickGoBackButton}
        />
        {detailLocationData ? (
          <span className={styles.ResultTitle}>{detailLocationData.name}</span>
        ) : (
          <span className={styles.ResultTitle}>{selectedCategoryTitle}</span>
        )}
      </div>
      <img
        className={styles.DeleteIcon}
        src={deleteIcon}
        alt="검색어 지우기"
        onClick={resetSelectSearch}
      />
    </header>
  );
};

export default SearchResultHeader;
