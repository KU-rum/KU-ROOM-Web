import React from "react";

import noResultIcon from "@assets/icon/noResultSearch.svg";
import { useSearchedDepartmentQuery } from "@/queries";

import styles from "./SearchDepartmentList.module.css";

interface SearchDepartmentListProps {
  searchText: string;
  handleAddUserDepartment: (value: string) => void;
}

const SearchDepartmentList: React.FC<SearchDepartmentListProps> = ({
  searchText,
  handleAddUserDepartment,
}) => {
  const {
    debouncedText,
    searchedDepartmentsData,
    isPendingSearchedDepartments,
  } = useSearchedDepartmentQuery(searchText);

  const trimmed = searchText.trim();
  const isDebouncing = trimmed !== debouncedText.trim();

  const shouldShowEmpty =
    trimmed.length > 0 &&
    !isDebouncing &&
    !isPendingSearchedDepartments &&
    Array.isArray(searchedDepartmentsData) &&
    searchedDepartmentsData.length === 0;

  return (
    <div className={styles.SearchedListWrapper}>
      {isPendingSearchedDepartments || isDebouncing ? (
        <div className={styles.EmptyLoadingWrapper}>
          <img src={noResultIcon} alt="검색 중" />
          <span className={styles.EmptyLoadingText}>검색 중 ...</span>
        </div>
      ) : searchedDepartmentsData && searchedDepartmentsData.length > 0 ? (
        searchedDepartmentsData.map((item) => (
          <div
            key={item.department}
            className={styles.SearchedDepartmentContainer}
            onClick={() => handleAddUserDepartment(item.department)}
          >
            <div className={styles.DepartmentInfoWrapper}>
              <span className={styles.DepartmentTitle}>{item.department}</span>
              <span className={styles.CollegeTitle}>{item.college}</span>
            </div>
          </div>
        ))
      ) : shouldShowEmpty ? (
        <div className={styles.EmptyLoadingWrapper}>
          <img src={noResultIcon} alt="검색 결과 없음" />
          <span className={styles.EmptyLoadingText}>검색 결과가 없어요!</span>
        </div>
      ) : null}
    </div>
  );
};

export default SearchDepartmentList;
