import { useRef } from "react";
import styles from "./BottomSheet.module.css";
import useBottomSheetDrag from "./use-bottom-sheet-drag";

interface BottomSheetProps {
  isOpen: boolean;
  handleCloseBottomSheet: () => void;
  children: React.ReactNode;
  sheetHeight: number;
}

export default function BottomSheet({
  isOpen,
  handleCloseBottomSheet,
  children,
  sheetHeight,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useBottomSheetDrag({
    sheetRef,
    handleCloseBottomSheet,
    sheetHeight,
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && handleCloseBottomSheet) {
      handleCloseBottomSheet();
    }
  };

  return (
    <div
      data-overlay="true"
      onClick={handleOverlayClick}
      className={styles.Overlay}
      style={
        isOpen
          ? { pointerEvents: "auto", opacity: 1 }
          : { pointerEvents: "none", opacity: 0 }
      }
    >
      <div
        ref={sheetRef}
        className={styles.BottomSheet}
        style={{
          transform: `translateY(${isOpen ? "0%" : "100%"})`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.Indicator} />
        <div className={styles.Content}>{children}</div>
      </div>
    </div>
  );
}
