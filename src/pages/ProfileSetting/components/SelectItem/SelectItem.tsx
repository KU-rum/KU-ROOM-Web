import React from 'react';
import styles from './SelectItem.module.css';

interface SelectItemProps {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
}

const SelectItem: React.FC<SelectItemProps> = ({
  text,
  onClick,
  isSelected = false
}) => {
  return (
    <div className={`${styles["select-item"]} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
      {text}
      <svg
        className={styles["check-icon"]}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12L10 17L19 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default SelectItem;
