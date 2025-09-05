import type React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "@components/Header/Header";
import styles from "./NoticeDetail.module.css";

const NoticeDetail: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // URL 파라미터로 전달된 link로 바로 리디렉션
      const searchParams = new URLSearchParams(window.location.search);
      const link = searchParams.get('link');
      
      if (link) {
        window.open(decodeURIComponent(link), '_blank');
        // 뒤로가기
        navigate(-1);
      }
    }
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles["notice-detail-container"]}>
      <div className={styles["header-wrapper"]}>
        <Header>{category || "학사"}</Header>
        <button
          className={styles["back-button"]}
          onClick={handleGoBack}
          aria-label="뒤로가기"
          type="button"
        />
      </div>

      <div className={styles["notice-content-wrapper"]}>
        <div className={styles["loading-indicator"]}>
          <p>공지사항 페이지로 이동 중입니다...</p>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;