import ArrowIcon from "@assets/icon/notice/search/sevrondown.svg";
import type { SortOption } from "../../types";
import { SORT_OPTIONS } from "../../constants";
import styles from "./SortDropdown.module.css";

interface SortDropdownProps {
  sortOrder: SortOption;
  showSort: boolean;
  onToggleSort: () => void;
  onSortOptionClick: (option: SortOption) => void;
  sortOptionsRef: React.RefObject<HTMLDivElement | null>;
}

export const SortDropdown = ({
  sortOrder,
  showSort,
  onToggleSort,
  onSortOptionClick,
  sortOptionsRef
}: SortDropdownProps) => {
  return (
    <div className={styles["sort-order-wrapper"]}>
      <div className={styles["sort-dropdown"]} ref={sortOptionsRef}>
        <button
          className={styles["sort-setting"]}
          onClick={onToggleSort}
          aria-label={`정렬 방식 변경: 현재 ${sortOrder}`}
          type="button"
        >
          {sortOrder}
          <img
            src={ArrowIcon}
            alt="정렬 화살표"
            className={styles["dropdown-arrow"]}
          />
        </button>

        {showSort && (
          <div className={styles["sort-options"]}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                className={`${styles["sort-option"]} ${sortOrder === option ? styles["active"] : ""}`}
                onClick={() => onSortOptionClick(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};