import { ClipLoader } from "react-spinners";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.Overlay}>
      <ClipLoader size={35} color="#009733" />
    </div>
  );
};

export default LoadingSpinner;
