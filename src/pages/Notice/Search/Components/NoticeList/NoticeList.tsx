import React from "react";

import type { NoticeItem } from "../../../types/noticeTypes";
import styles from "./NoticeList.module.css";

interface NoticeListProps {
  notices: NoticeItem[];
  onItemClick?: (noticeId: number) => void;
}

export const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  onItemClick,
}) => {
  return (
    <div className={styles.noticeList}>
      {notices.map((notice, index) => (
        <div
          key={notice.id}
          className={styles.noticeItem}
          onClick={() => onItemClick?.(notice.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onItemClick?.(notice.id);
            }
          }}
          tabIndex={onItemClick ? 0 : -1}
          style={{ cursor: onItemClick ? "pointer" : "default" }}
        >
          <span className={styles.noticeNumber}>{index + 1}</span>
          <p className={styles.noticeTitle}>{notice.title}</p>
        </div>
      ))}
    </div>
  );
};
