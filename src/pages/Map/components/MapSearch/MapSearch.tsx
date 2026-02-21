import React, { useEffect, useRef, useState } from "react";

import BottomBar from "@components/BottomBar/BottomBar";
import arrowBack from "@assets/nav/arrowback.svg";
import deleteIcon from "@assets/icon/deleteIcon.svg";
import noResultIcon from "@assets/icon/noResultSearch.svg";
import kuroomEmptyIcon from "@assets/icon/kuroom-icon/kuroom-gray.svg";
import { MapSearchResult } from "@apis/types";

import { useSearchLocationQuery } from "../../hooks/use-search-location-query";
import { useLocationKeyword } from "../../hooks/use-location-keyword";
import styles from "./MapSearch.module.css";

interface MapSearchProps {
  setSearchMode: (value: boolean) => void;
  clickSearchResultToMarker: (value: MapSearchResult) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({
  setSearchMode,
  clickSearchResultToMarker,
}) => {
  const [searchText, setSearchText] = useState("");

  const {
    locationSearchResult,
    isPendingSearch,
    recentLocationKeyword,
    isPendingRecentSearch,
  } = useSearchLocationQuery(searchText);

  const { saveLocationKeyword, deleteRecentKeyword, deleteAllRecentKeyword } =
    useLocationKeyword();

  const searchFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => searchFocusRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const resetSearchText = () => {
    setSearchText("");
    searchFocusRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchText.trim() === "") setSearchText("");
    if (e.key === "Enter" && searchText.trim() !== "") {
      saveLocationKeyword(searchText);
    }
  };

  const doAgainRecentSearch = (name: string) => {
    setSearchText(name);
    saveLocationKeyword(name);
  };

  const handleClickLocation = (location: MapSearchResult) => {
    setSearchMode(false);
    clickSearchResultToMarker(location);
    saveLocationKeyword(location.name);
  };

  return (
    <div className={styles.SearchModeContainer}>
      <div className={styles.SearchBarContainer}>
        <div className={styles.LeftContentWrapper}>
          <img
            className={styles.ArrowIcon}
            src={arrowBack}
            alt="뒤로 가기"
            onClick={() => setSearchMode(false)}
          />
          <input
            className={styles.SearchText}
            ref={searchFocusRef}
            type="search"
            enterKeyHint="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="건물명, 강의실명, 건물 번호 검색"
            autoFocus
          />
        </div>
        {searchText && (
          <img
            className={styles.DeleteIcon}
            src={deleteIcon}
            alt="검색어 지우기"
            onClick={resetSearchText}
          />
        )}
      </div>
      {!searchText &&
        recentLocationKeyword &&
        recentLocationKeyword.length !== 0 && (
          <>
            <div className={styles.RecentSearchTitleWrapper}>
              <span className={styles.RecentSearchTitle}>최근 검색어</span>
              <button
                className={styles.RecentSearchDelete}
                onClick={() => deleteAllRecentKeyword()}
              >
                검색어 기록 전체 삭제
              </button>
            </div>
            <div className={styles.RecentSearchDataWrapper}>
              {recentLocationKeyword.map((item) => (
                <div
                  key={item.placeHistoryId}
                  className={styles.RecentSearchContainer}
                  onClick={() => doAgainRecentSearch(item.name)}
                >
                  <span className={styles.LocationTitle}>{item.name}</span>
                  <img
                    src={deleteIcon}
                    alt="검색어 지우기"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRecentKeyword(item.placeHistoryId);
                    }}
                    style={{ padding: "2px 5px" }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      {!searchText &&
        recentLocationKeyword &&
        recentLocationKeyword.length === 0 &&
        (isPendingRecentSearch ? (
          <div className={styles.EmptyView}>
            <img src={kuroomEmptyIcon} className={styles.EmptyIcon} />
            <span>최근 검색어 내역을 불러오는 중입니다...</span>
          </div>
        ) : (
          <div className={styles.EmptyView}>
            <img src={kuroomEmptyIcon} className={styles.EmptyIcon} />
            <span>
              최근 검색어 내역이 없습니다.
              <br />
              궁금한 장소를 검색해보세요!
            </span>
          </div>
        ))}

      {searchText.trim() &&
        (locationSearchResult && locationSearchResult.length !== 0 ? (
          <div className={styles.ResultWrapper}>
            {locationSearchResult.map((result) => (
              <div
                key={result.placeId}
                className={styles.ResultContainer}
                onClick={() => handleClickLocation(result)}
              >
                <span className={styles.LocationTitle}>{result.name}</span>
              </div>
            ))}
          </div>
        ) : isPendingSearch ? (
          <div className={styles.NoResultContainer}>
            <img
              src={noResultIcon}
              alt="검색 결과 없음"
              style={{ width: "64px" }}
            />
            <span className={styles.NoResultText}>검색 중입니다...</span>
          </div>
        ) : (
          <div className={styles.NoResultContainer}>
            <img
              src={noResultIcon}
              alt="검색 결과 없음"
              style={{ width: "64px" }}
            />
            <span className={styles.NoResultText}>검색 결과가 없어요!</span>
          </div>
        ))}
      <BottomBar />
    </div>
  );
};

export default MapSearch;
