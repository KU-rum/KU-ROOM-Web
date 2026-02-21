import splashIcon from "@assets/splash-icon.svg";

import styles from "./Splash.module.css";

const Splash = () => {
  return (
    <div className={styles.SplashPage}>
      <img src={splashIcon} />
      <h1 className={styles.Title}>KUROOM</h1>
    </div>
  );
};

export default Splash;
