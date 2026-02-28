import { useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";

import ArrowBackIcon from "@assets/nav/arrowBackWhite.svg";
import ImagePrev from "@assets/nav/image-prev-button.svg";
import ImageNext from "@assets/nav/image-next-button.svg";

import styles from "./ImageDetails.module.css";

interface ImageDetailsProps {
  clickedIndex?: number;
  imageUrls: string[];
  handleCloseImageDetail: () => void;
}

type SwipeDirection = "next" | "prev";

const SWIPE_THRESHOLD = 150;
const ZOOM_THRESHOLD = 1.1;
const EDGE_THRESHOLD = 8;

const SLIDE_ITEM_STYLE = {
  flex: "0 0 100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
} as const;

export default function ImageDetails({
  clickedIndex = 0,
  imageUrls,
  handleCloseImageDetail,
}: ImageDetailsProps) {
  const [currentIndex, setCurrentIndex] = useState(clickedIndex);
  const [imageScales, setImageScales] = useState<Record<number, number>>({});

  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const edgeSwipeArmedRef = useRef<SwipeDirection | null>(null);
  const transformRefs = useRef<
    Record<number, ReactZoomPanPinchContentRef | null>
  >({});
  const isCurrentImageZoomed =
    (imageScales[currentIndex] ?? 1) > ZOOM_THRESHOLD;

  const clearDragState = () => {
    isDraggingRef.current = false;
    startXRef.current = null;
  };

  const resetImageZoom = (index: number): void => {
    transformRefs.current[index]?.resetTransform();
    setImageScales((prev) => ({ ...prev, [index]: 1 }));
  };

  const handlePrev = (): void => {
    if (currentIndex === 0) return;
    edgeSwipeArmedRef.current = null;
    const nextIndex = currentIndex - 1;
    resetImageZoom(currentIndex);
    resetImageZoom(nextIndex);
    setCurrentIndex(nextIndex);
  };

  const handleNext = (): void => {
    if (currentIndex === imageUrls.length - 1) return;
    edgeSwipeArmedRef.current = null;
    const nextIndex = currentIndex + 1;
    resetImageZoom(currentIndex);
    resetImageZoom(nextIndex);
    setCurrentIndex(nextIndex);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (e.touches.length !== 1) return;
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const isSwipeBlockedByZoomEdge = (diffX: number): boolean => {
    if (!isCurrentImageZoomed) {
      edgeSwipeArmedRef.current = null;
      return false;
    }

    const currentRef = transformRefs.current[currentIndex];
    const scale = imageScales[currentIndex] ?? 1;
    const positionX = currentRef?.instance.transformState.positionX ?? 0;
    const wrapperWidth =
      currentRef?.instance.wrapperComponent?.clientWidth ?? window.innerWidth;
    const maxAbsX = ((scale - 1) * wrapperWidth) / 2;

    const isLeftEdge = positionX >= maxAbsX - EDGE_THRESHOLD;
    const isRightEdge = positionX <= -maxAbsX + EDGE_THRESHOLD;
    const wantsNext = diffX > 0;
    const wantsPrev = diffX < 0;

    if ((wantsNext && !isRightEdge) || (wantsPrev && !isLeftEdge)) {
      edgeSwipeArmedRef.current = null;
      return true;
    }

    if (wantsNext && isRightEdge) {
      if (edgeSwipeArmedRef.current !== "next") {
        edgeSwipeArmedRef.current = "next";
        return true;
      }
      return false;
    }

    if (wantsPrev && isLeftEdge) {
      if (edgeSwipeArmedRef.current !== "prev") {
        edgeSwipeArmedRef.current = "prev";
        return true;
      }
      return false;
    }

    edgeSwipeArmedRef.current = null;
    return true;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!isDraggingRef.current || startXRef.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = startXRef.current - endX;

    if (isSwipeBlockedByZoomEdge(diffX)) {
      clearDragState();
      return;
    }

    if (diffX > SWIPE_THRESHOLD && currentIndex !== imageUrls.length - 1) {
      handleNext();
    } else if (diffX < -SWIPE_THRESHOLD && currentIndex !== 0) {
      handlePrev();
    }

    clearDragState();
  };

  return (
    imageUrls && (
      <div className={styles.ImageDetailsPage}>
        <header className={styles.Header}>
          <img
            src={ArrowBackIcon}
            alt="닫기"
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
              <div style={SLIDE_ITEM_STYLE} key={idx}>
                <TransformWrapper
                  ref={(ref) => {
                    transformRefs.current[idx] = ref;
                  }}
                  initialScale={1}
                  minScale={1} // 최소 축소 비율
                  maxScale={3} // 최대 확대 비율
                  doubleClick={{ disabled: false, mode: "toggle", step: 1.5 }}
                  wheel={{ step: 0.1 }} // 마우스 휠 줌 속도
                  pinch={{ step: 5 }} // 핀치 줌 감도
                  panning={{ disabled: !isCurrentImageZoomed }}
                  centerZoomedOut
                  onTransformed={(_, state) => {
                    setImageScales((prev) => ({ ...prev, [idx]: state.scale }));
                  }}
                >
                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100dvh" }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      className={styles.Image}
                      src={img}
                      alt={`상세 이미지 ${idx + 1}`}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
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
