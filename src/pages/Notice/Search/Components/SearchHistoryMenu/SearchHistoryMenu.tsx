import React from "react";

import trashIcon from "@assets/icon/notice/search/trash.svg";

import { ToggleButton } from "../ToggleButton";
import styles from "./SearchHistoryMenu.module.css";

interface SearchHistoryMenuProps {
  isHistoryEnabled: boolean;
  onToggleHistory: () => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const SearchHistoryMenu: React.FC<SearchHistoryMenuProps> = ({
  isHistoryEnabled,
  onToggleHistory,
  onClearHistory,
  onClose,
}) => {
  const handleClearClick = () => {
    onClearHistory();
    onClose();
  };

  return (
    <div>
      <div
        className={styles.menuOverlay}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div
          className={styles.menuContainer}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
        >
          <div className={styles.menuItem}>
            <span className={styles.menuLabel}>최근 검색어 저장</span>
            <div className={styles.toggleContainer}>
              <ToggleButton
                isOn={isHistoryEnabled}
                onToggle={onToggleHistory}
              />
            </div>
          </div>
          <div className={styles.divider} />
          <button
            className={styles.menuItem}
            onClick={handleClearClick}
            type="button"
          >
            <span className={`${styles.menuLabel} ${styles.delete}`}>
              최근 검색어 초기화
            </span>
            <div className={styles.toggleContainer}>
              <img src={trashIcon} alt="삭제" className={styles.trashIcon} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
