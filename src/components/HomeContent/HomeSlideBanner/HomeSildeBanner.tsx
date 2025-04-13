import styles from "./HomeSlideBanner.module.css";
import exBannerImg from "../../../assets/ExampleImg/slidebannerImg/exBanner1.svg";
import { useEffect, useRef, useState } from "react";

const exampleImg = [
  { title: "EX1", img: exBannerImg },
  { title: "EX2", img: exBannerImg },
  { title: "EX3", img: exBannerImg },
  { title: "EX4", img: exBannerImg },
];

const HomeSildeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const bannerWidth = 349;
  const getScrollLeft = (index: number) => {
    const sidePadding = (window.innerWidth - bannerWidth) / 2;
    return index * bannerWidth - sidePadding;
  };

  // 스크롤이 끝났을 때 가장 가까운 배너로 강제 고정되도록 수정.
  let scrollTimeout: ReturnType<typeof setTimeout>;

  const handleScroll = () => {
    if (!wrapperRef.current) return;

    const scrollLeft = wrapperRef.current.scrollLeft;
    const sidePadding = (window.innerWidth - bannerWidth) / 2;
    const adjustedScrollLeft = scrollLeft + sidePadding;
    const index = Math.round(adjustedScrollLeft / bannerWidth);

    // 스크롤 도중 계속 호출되지 않도록 delay 보정
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      handleBannerMove(index); // 스크롤 위치 정확히 맞춰줌
    }, 50); // 스크롤 멈춘 뒤 보정
  };

  const handleBannerMove = (index: number) => {
    if (!wrapperRef.current) return;

    wrapperRef.current.scrollTo({
      left: getScrollLeft(index),
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  // 자동 슬라이드(3초간격)
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % exampleImg.length;
      handleBannerMove(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // 처음 마운트 시 0번째로 정렬
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTo({
        left: getScrollLeft(0),
        behavior: "auto",
      });
    }
  }, []);

  return (
    <div className={styles.HomeSlideBannerWrapper}>
      <div
        className={styles.BannerImgWrapper}
        ref={wrapperRef}
        onScroll={handleScroll}
      >
        {exampleImg.map((item, index) => (
          <img
            key={index}
            className={styles.BannerImg}
            src={item.img}
            alt={item.title}
          />
        ))}
      </div>
      <div className={styles.DotsWrapper}>
        {exampleImg.map((_, index) => (
          <div
            key={index}
            className={`${styles.DotIndicator} ${
              currentIndex === index ? styles.ActiveDot : ""
            }`}
            onClick={() => handleBannerMove(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSildeBanner;
