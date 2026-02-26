import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./HomeSlideBanner.module.css";
import { useBannersQuery } from "@/queries";

const HomeSildeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { bannerData, isPendingBanner, isErrorBanner } = useBannersQuery();

  const hasBanners = !!bannerData?.length;

  const currentDeviceWidth = window.innerWidth > 600 ? 600 : window.innerWidth;

  const bannerWidth = 349;

  const getScrollLeft = useCallback(
    (index: number) => {
      const sidePadding = (currentDeviceWidth - bannerWidth) / 2;
      return index * bannerWidth - sidePadding;
    },
    [currentDeviceWidth],
  );

  // 스크롤이 끝났을 때 가장 가까운 배너로 강제 고정되도록 수정.
  let scrollTimeout: ReturnType<typeof setTimeout>;

  const handleScroll = () => {
    if (!wrapperRef.current) return;

    const scrollLeft = wrapperRef.current.scrollLeft;
    const sidePadding = (currentDeviceWidth - bannerWidth) / 2;
    const adjustedScrollLeft = scrollLeft + sidePadding;
    const index = Math.round(adjustedScrollLeft / bannerWidth);

    // 스크롤 도중 계속 호출되지 않도록 delay 보정
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      handleBannerMove(index);
    }, 100);
  };

  const handleBannerMove = useCallback(
    (index: number) => {
      if (!wrapperRef.current) return;

      wrapperRef.current.scrollTo({
        left: getScrollLeft(index),
        behavior: "smooth",
      });

      setCurrentIndex(index);
    },
    [getScrollLeft],
  );

  const handleToBannerLink = (bannerLink: string) => {
    if (!bannerLink) return;
    window.open(bannerLink, "_blank", "noopener,noreferrer");
  };

  // 3초 간격 자동 슬라이드
  useEffect(() => {
    if (!bannerData) return;
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % bannerData.length;
      handleBannerMove(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, handleBannerMove, bannerData]);

  return (
    <div className={styles.HomeSlideBannerWrapper}>
      <div
        className={styles.BannerImgWrapper}
        ref={wrapperRef}
        onScroll={handleScroll}
      >
        {isPendingBanner && (
          <div className={styles.Skeleton}>
            <span className={styles.SkeletonText}>배너 불러오는 중..</span>
          </div>
        )}

        {!isPendingBanner && isErrorBanner && (
          <div className={styles.Skeleton}>
            <span className={styles.ErrorText}>
              배너를 불러오지 못했어요 😭
            </span>
          </div>
        )}

        {!isPendingBanner && !isErrorBanner && hasBanners && (
          <>
            {bannerData!.map((banner) => (
              <button
                key={banner.bannerId}
                type="button"
                onClick={() => handleToBannerLink(banner.bannerLink)}
              >
                <img
                  className={styles.BannerImg}
                  src={banner.bannerImageUrl}
                  alt={`배너-${banner.bannerId}`}
                />
              </button>
            ))}
          </>
        )}

        {!isPendingBanner && !isErrorBanner && !hasBanners && (
          <div className={styles.Skeleton}>
            <span className={styles.SkeletonText}>표시할 배너가 없어요</span>
          </div>
        )}
      </div>

      <div className={styles.DotsWrapper}>
        {isPendingBanner && <button className={styles.DotIndicator} />}

        {!isPendingBanner && !isErrorBanner && hasBanners && (
          <>
            {bannerData!.map((banner, index) => (
              <button
                type="button"
                key={banner.bannerId}
                className={`${styles.DotIndicator} ${
                  currentIndex === index ? styles.ActiveDot : ""
                }`}
                onClick={() => handleBannerMove(index)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeSildeBanner;
