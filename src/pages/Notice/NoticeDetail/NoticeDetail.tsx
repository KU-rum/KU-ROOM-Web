import type React from "react";
import { useParams } from "react-router-dom";
import { NoticeDetailHeader, NoticeContent } from "./components";
import { useNoticeDetail } from "./hooks/useNoticeDetail";
import styles from "./NoticeDetail.module.css";

const NoticeDetail: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const { 
    notice, 
    loading, 
    error, 
    handleBookmarkToggle, 
    handleOriginalLinkClick 
  } = useNoticeDetail(id);

  if (loading) {
    return (
      <div className={styles["notice-detail-container"]}>
        <div className={styles["loading-indicator"]}>
          <p>공지사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["notice-detail-container"]}>
        <div className={styles["error-message"]}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className={styles["notice-detail-container"]}>
        <div className={styles["error-message"]}>
          <p>공지사항을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["notice-detail-container"]}>
      <NoticeDetailHeader 
        notice={notice}
        category={category}
        onBookmarkToggle={handleBookmarkToggle}
      />
      
      <NoticeContent 
        notice={notice}
        onOriginalLinkClick={handleOriginalLinkClick}
      />
    </div>
  );
};

export default NoticeDetail;