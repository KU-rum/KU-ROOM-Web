import React from "react";

import NotAgreeIcon from "@assets/icon/notagree.svg";
import CheckAgreeIcon from "@assets/icon/checkagree.svg";

import styles from "./AgreementLabel.module.css";

interface LabelProps {
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  bold?: boolean;
}

const AgreementLabel: React.FC<LabelProps> = ({
  children,
  checked,
  onChange,
  disabled = false,
  bold = false,
}) => {
  return (
    <label className={`${styles["agree-container"]} ${bold ? styles.bold : ""}`}>
      <div style={{ position: "relative" }}>
        <img src={NotAgreeIcon} alt="동의 여부" />
        {checked && (
          <img
            src={CheckAgreeIcon}
            alt="동의"
            className={`${styles["green-check"]} ${bold ? styles.bold : ""}`}
          />
        )}
      </div>

      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={styles["hidden-checkbox"]}
      />
      {children}
    </label>
  );
};

export default AgreementLabel;
