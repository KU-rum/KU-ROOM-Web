import { useEffect, useRef } from "react";
import { resetFocusedMarker } from "../utils/kuroomMapUtils";

interface UseBottomSheetDragProps {
  sheetRef: React.RefObject<HTMLDivElement | null>;
  isExpanded: boolean;
  hasFocusedMarker?: boolean;
  setIsExpanded: (value: boolean) => void;
  setHasFocusedMarker?: (value: boolean) => void;
  minHeight: number; // 예: 150, 380 등
  disabled?: boolean;
}

export default function useBottomSheetDrag({
  sheetRef,
  isExpanded,
  hasFocusedMarker,
  setIsExpanded,
  setHasFocusedMarker,
  minHeight,
  disabled = false,
}: UseBottomSheetDragProps) {
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const canDrag = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY;
      sheet.style.transition = "none";

      // 실제 스크롤이 필요한지 확인
      const hasScrollableContent = sheet.scrollHeight > sheet.clientHeight;
      const isAtTop = sheet.scrollTop <= 10;

      // 스크롤 가능한 콘텐츠가 있고 최상단에 있을 때만 드래그 허용
      // 또는 스크롤 가능한 콘텐츠가 없을 때는 항상 드래그 허용
      canDrag.current = !hasScrollableContent || isAtTop;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      // 실시간으로 스크롤 상태 재확인
      const hasScrollableContent = sheet.scrollHeight > sheet.clientHeight;
      const isAtTop = sheet.scrollTop <= 10;
      canDrag.current = !hasScrollableContent || isAtTop;

      if (!canDrag.current) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0) {
        const maxTranslate = window.innerHeight - minHeight;
        const limitedDiff = Math.min(diff, maxTranslate);
        sheet.style.transform = `translateY(${limitedDiff}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current || !canDrag.current) return;
      const diff = currentY.current - startY.current;
      sheet.style.transition = "transform 0.3s ease-in-out";

      // 클릭만 한 경우라면 아무 동작 하지 않게
      if (currentY.current === 0) {
        isDragging.current = false;
        startY.current = 0;
        return;
      }

      if (Math.abs(diff) < 10) {
        sheet.style.transform = isExpanded
          ? "translateY(0)"
          : `translateY(calc(100% - ${minHeight}px))`;
        isDragging.current = false;
        return;
      }

      if (diff > 100) {
        setIsExpanded(false);
        sheet.style.transform = `translateY(calc(100% - ${minHeight}px))`;
      } else if (diff < -80) {
        setIsExpanded(true);
        sheet.style.transform = "translateY(0)";
      } else {
        sheet.style.transform = isExpanded
          ? "translateY(0)"
          : `translateY(calc(100% - ${minHeight}px))`;
      }

      if (!isExpanded && hasFocusedMarker && setHasFocusedMarker && diff > 80) {
        resetFocusedMarker(setHasFocusedMarker);
      }

      isDragging.current = false;
      canDrag.current = false;
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
  }, [
    isExpanded,
    minHeight,
    setIsExpanded,
    sheetRef,
    hasFocusedMarker,
    setHasFocusedMarker,
    disabled,
  ]);
}
