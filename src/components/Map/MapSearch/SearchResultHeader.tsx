import React from "react";
import styles from "./SearchResultHeader.module.css";
import arrowBack from "../../../assets/nav/arrowback.svg";
import deleteIcon from "../../../assets/icon/deleteIcon.svg";

interface CategoryChip {
  title: string;
  icon: string;
  category: number;
}
interface Building {
  id: number | null;
  abbreviation: string;
  name: string;
  number: number;
  latitude: number;
  longitude: number;
}

interface Place {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
  building: Building;
}
interface SearchResultProps {
  selectedCategory: CategoryChip | null;
  mapSearchResult: string;
  setSearchMode: (value: boolean) => void;
  setSelectedCategory: (value: CategoryChip | null) => void;
  setMapSearchResult: (value: string) => void;
  setMarkers: (value: Place[]) => void;
  setIsExpandedSheet: (value: boolean) => void;
  setHasFocusedMarker: (value: boolean) => void;
  setIsExpandedFocusedSheet: (value: boolean) => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  selectedCategory,
  mapSearchResult,
  setSearchMode,
  setSelectedCategory,
  setMapSearchResult,
  setMarkers,
  setIsExpandedSheet,
  setHasFocusedMarker,
  setIsExpandedFocusedSheet,
}) => {
  return (
    <header className={styles.SearchResultContainer}>
      <div className={styles.LeftContentWrapper}>
        <img
          className={styles.ArrowIcon}
          src={arrowBack}
          alt="뒤로 가기"
          onClick={() => {
            setSearchMode(false);
            setSelectedCategory(null);
            setMapSearchResult("");
            setMarkers([]);
            setIsExpandedSheet(false);
            setHasFocusedMarker(false);
            setIsExpandedFocusedSheet(false);
          }}
        />
        {selectedCategory && (
          <span className={styles.ResultTitle}>{selectedCategory.title}</span>
        )}
        {mapSearchResult && (
          <span className={styles.ResultTitle}>{mapSearchResult}</span>
        )}
      </div>
      <img
        className={styles.DeleteIcon}
        src={deleteIcon}
        alt="검색어 지우기"
        onClick={() => {
          setMapSearchResult("");
          setSearchMode(true);
          setMarkers([]);
          setIsExpandedSheet(false);
          setHasFocusedMarker(false);
          setIsExpandedFocusedSheet(false);
        }}
      />
    </header>
  );
};

export default SearchResult;
