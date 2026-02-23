import { useRef, useState } from "react";

import ArrowBackIcon from "@assets/nav/arrowBackWhite.svg";
import ImagePrev from "@assets/nav/image-prev-button.svg";
import ImageNext from "@assets/nav/image-next-button.svg";

import styles from "./ImageDetails.module.css";

interface ImageDetailsProps {
  clickedIndex?: number;
  imageUrls: string[];
  handleCloseImageDetail: () => void;
}

export default function ImageDetails({
  clickedIndex = 0,
  imageUrls,
  handleCloseImageDetail,
}: ImageDetailsProps) {
  const [currentIndex, setCurrentIndex] = useState(clickedIndex);

  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const handlePrev = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || startXRef.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = startXRef.current - endX;

    // 임계값 (50px 이상 이동해야 동작)
    if (diffX > 50 && currentIndex !== imageUrls.length - 1) {
      handleNext();
    } else if (diffX < -50 && currentIndex !== 0) {
      handlePrev();
    }

    isDraggingRef.current = false;
    startXRef.current = null;
  };

  return (
    imageUrls && (
      <div className={styles.ImageDetailsPage}>
        <header className={styles.Header}>
          <img
            src={ArrowBackIcon}
            alt="내리기"
            onClick={handleCloseImageDetail}
          />
          <span className={styles.StepIndicator}>
            {currentIndex + 1} / {imageUrls.length}
          </span>
        </header>
        <div
          className={styles.ImageWrapper}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentIndex !== 0 && (
            <img
              className={styles.PrevButton}
              src={ImagePrev}
              onClick={handlePrev}
            />
          )}
          <div
            className={styles.Slider}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {imageUrls.map((img, idx) => (
              <img
                key={idx}
                className={styles.Image}
                src={img}
                alt={`상세 이미지 ${idx + 1}`}
              />
            ))}
          </div>
          {currentIndex + 1 !== imageUrls.length && (
            <img
              className={styles.NextButton}
              src={ImageNext}
              onClick={handleNext}
            />
          )}
        </div>
      </div>
    )
  );
}
