import React, { useState } from "react";

import kebabIcon from "@assets/icon/notice/search/kebab.svg";

import { SearchTag } from "../SearchTag";
import { SearchHistoryMenu } from "../SearchHistoryMenu";
import styles from "./SearchHistory.module.css";

interface SearchHistoryProps {
  searchTerms: string[];
  onRemoveTerm: (term: string) => void;
  onSelectTerm: (term: string) => void;
  isHistoryEnabled: boolean;
  onToggleHistory: () => void;
  onClearHistory: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchTerms,
  onRemoveTerm,
  onSelectTerm,
  isHistoryEnabled,
  onToggleHistory,
  onClearHistory,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleKebabClick = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className={styles.searchHistoryContainer}>
      <div className={styles.searchHistoryHeader}>
        <h2 className={styles.sectionTitle}>최근 검색어</h2>
        <button
          onClick={handleKebabClick}
          className={styles.kebabButton}
          type="button"
          aria-label="검색 기록 설정"
        >
          <img src={kebabIcon} alt="더보기" />
        </button>
      </div>

      {showMenu && (
        <SearchHistoryMenu
          isHistoryEnabled={isHistoryEnabled}
          onToggleHistory={onToggleHistory}
          onClearHistory={onClearHistory}
          onClose={handleCloseMenu}
        />
      )}

      {isHistoryEnabled && searchTerms.length > 0 && (
        <div className={styles.searchHistory}>
          <div className={styles.tagContainer}>
            {searchTerms.map((term) => (
              <div
                key={term}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTerm(term)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectTerm(term);
                  }
                }}
                className={styles.searchButton}
              >
                <SearchTag text={term} onRemove={() => onRemoveTerm(term)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
