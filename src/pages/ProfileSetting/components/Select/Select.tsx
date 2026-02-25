import React from 'react';
import styles from './Select.module.css';

interface SelectProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  placeholder,
  onClick,
  disabled = false
}) => {
  return (
    <div className={styles["select-container"]}>
      <label className={styles["select-label"]}>{label}</label>
      <div
        className={`${styles["select-field"]} ${disabled ? styles.disabled : ''}`}
        onClick={disabled ? undefined : onClick}
      >
        {value ? (
          <span className={styles["select-value"]}>{value}</span>
        ) : (
          <span className={styles["select-placeholder"]}>{placeholder}</span>
        )}
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["select-arrow"]}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
