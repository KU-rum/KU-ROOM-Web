import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./HomeSlideBanner.module.css";
import { useBannersQuery } from "@/queries";

const HomeSlideBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedBannerIds, setLoadedBannerIds] = useState<Set<number>>(new Set());
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

  // scroll debounce timeout for snap behavior
  let scrollTimeout: ReturnType<typeof setTimeout>;

  const handleScroll = () => {
    if (!wrapperRef.current) return;

    const scrollLeft = wrapperRef.current.scrollLeft;
    const sidePadding = (currentDeviceWidth - bannerWidth) / 2;
    const adjustedScrollLeft = scrollLeft + sidePadding;
    const index = Math.round(adjustedScrollLeft / bannerWidth);

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

    try {
      const url = new URL(bannerLink);
      if (!["http:", "https:"].includes(url.protocol)) return;
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
      return;
    }
  };

  const handleBannerImageLoad = useCallback((bannerId: number) => {
    setLoadedBannerIds((prev) => {
      if (prev.has(bannerId)) return prev;

      const next = new Set(prev);
      next.add(bannerId);
      return next;
    });
  }, []);

  useEffect(() => {
    setLoadedBannerIds(new Set());
  }, [bannerData]);

  useEffect(() => {
    if (!bannerData?.length) return;

    const interval = setInterval(() => {
      const next = (currentIndex + 1) % bannerData.length;
      handleBannerMove(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, handleBannerMove, bannerData?.length]);

  return (
    <div className={styles.HomeSlideBannerWrapper}>
      <div
        className={styles.BannerImgWrapper}
        ref={wrapperRef}
        onScroll={handleScroll}
      >
        {isPendingBanner && (
          <div className={styles.Skeleton}>
            <span className={styles.SkeletonText}>배너를 불러오는 중이에요.</span>
          </div>
        )}

        {!isPendingBanner && isErrorBanner && (
          <div className={styles.Skeleton}>
            <span className={styles.ErrorText}>배너를 불러오지 못했어요.</span>
          </div>
        )}

        {!isPendingBanner && !isErrorBanner && hasBanners && (
          <>
            {bannerData!.map((banner) => {
              const isLoaded = loadedBannerIds.has(banner.bannerId);

              return (
                <button
                  key={banner.bannerId}
                  type="button"
                  className={styles.BannerButton}
                  onClick={() => handleToBannerLink(banner.bannerLink)}
                >
                  {!isLoaded && <div className={styles.BannerSkeleton} />}
                  <img
                    className={`${styles.BannerImg} ${
                      isLoaded ? styles.BannerImgVisible : styles.BannerImgHidden
                    }`}
                    src={banner.bannerImageUrl}
                    alt={`배너-${banner.bannerId}`}
                    onLoad={() => handleBannerImageLoad(banner.bannerId)}
                    decoding="async"
                  />
                </button>
              );
            })}
          </>
        )}

        {!isPendingBanner && !isErrorBanner && !hasBanners && (
          <div className={styles.Skeleton}>
            <span className={styles.SkeletonText}>등록된 배너가 없어요.</span>
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

export default HomeSlideBanner;
