import cloudLogo from "@assets/pwa-guide/logo.svg";
import section1 from "@assets/pwa-guide/section1.png";
import section2 from "@assets/pwa-guide/section2.png";

import { usePwaGuide } from "./hooks/usePwaGuide";
import styles from "./PwaGuide.module.css";

const PwaGuide = () => {
  const { handleDismiss } = usePwaGuide();

  return (
    <div className={styles.Page}>
      <div className={styles.Header}>
        <img src={cloudLogo} alt="쿠룸 로고" className={styles.Logo} />
        <h1 className={styles.Title}>
          홈 화면에 쿠룸을 추가하고
          <br />
          이용해주세요!
        </h1>
        <p className={styles.Subtitle}>
          설치 환경에 따른 방법을 안내드려요.
        </p>
      </div>

      <img src={section1} alt="Safari 설치 가이드" className={styles.SectionImg} />
      <img src={section2} alt="Chrome 설치 가이드" className={styles.SectionImg} />

      <div className={styles.Bottom}>
        <span className={styles.DismissText} onClick={handleDismiss}>
          이미 설치했어요
        </span>
      </div>
    </div>
  );
};

export default PwaGuide;
