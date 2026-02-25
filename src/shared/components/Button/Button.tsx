import React from "react";
import styles from "./Button.module.css";
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: "sm" | "xs";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  size,
  disabled = false,
  variant = "primary",
}) => {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ""} ${size ? styles[size] : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
