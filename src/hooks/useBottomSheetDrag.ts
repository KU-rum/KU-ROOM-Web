import { useEffect, useRef } from "react";

interface UseBottomSheetDragProps {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  minHeight: number; // 예: 150, 380 등
}

export default function useBottomSheetDrag({
  sheetRef,
  isExpanded,
  setIsExpanded,
  minHeight,
}: UseBottomSheetDragProps) {
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  //   const canDragToClose = useRef(true);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY;
      sheet.style.transition = "none";
      //   canDragToClose.current = sheet.scrollTop === 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0) {
        const maxTranslate = window.innerHeight - minHeight;
        const limitedDiff = Math.min(diff, maxTranslate);
        sheet.style.transform = `translateY(${limitedDiff}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      const diff = currentY.current - startY.current;
      sheet.style.transition = "transform 0.3s ease-in-out";

      if (Math.abs(diff) < 10) {
        sheet.style.transform = isExpanded
          ? "translateY(0)"
          : `translateY(calc(100% - ${minHeight}px))`;
        isDragging.current = false;
        return;
      }

      if (diff > 60) {
        setIsExpanded(false);
        sheet.style.transform = `translateY(calc(100% - ${minHeight}px))`;
      } else {
        setIsExpanded(true);
        sheet.style.transform = "translateY(0)";
      }

      isDragging.current = false;
      startY.current = 0;
      currentY.current = 0;
    };

    sheet.addEventListener("touchstart", handleTouchStart);
    sheet.addEventListener("touchmove", handleTouchMove);
    sheet.addEventListener("touchend", handleTouchEnd);

    return () => {
      sheet.removeEventListener("touchstart", handleTouchStart);
      sheet.removeEventListener("touchmove", handleTouchMove);
      sheet.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isExpanded, minHeight, setIsExpanded, sheetRef]);
}
