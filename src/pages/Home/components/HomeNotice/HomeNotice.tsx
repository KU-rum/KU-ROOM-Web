import { useState } from "react";
import { useBookmarksQuery } from "@/queries";
import Loading from "@components/Loading/Loading";

import styles from "./HomeNotice.module.css";
import { useNavigate } from "react-router-dom";
import { NoticeResponse } from "@/apis/types";

const HomeNotice = () => {
  const navigate = useNavigate();
  const [noticeState, setNoticeState] = useState("북마크");

  const { bookmarksData, isPendingBookmarks, isErrorBookmarks } =
    useBookmarksQuery();

  const toSeeBookmark = () => {
    setNoticeState("북마크");
  };

  const handleNoticeClick = (notice: NoticeResponse) => {
    const categoryName = notice.categoryName;
    if (categoryName) {
      navigate(`/notice/${categoryName}/${notice.id}`);
    } else {
      navigate(`/notice/${notice.id}`);
    }
  };

  const renderContent = () => {
    if (isPendingBookmarks) {
      return <Loading type="section" sectionHeight={150} />;
    }

    if (isErrorBookmarks) {
      return (
        <div className={styles.ErrorEmptyContainer}>
          <span className={styles.ErrorEmptyText}>
            북마크한 공지사항을 불러오지 못했어요.
          </span>
        </div>
      );
    }

    if (bookmarksData?.length === 0) {
      return (
        <div className={styles.ErrorEmptyContainer}>
          <span className={styles.ErrorEmptyText}>
            아직 북마크한 공지사항이 없습니다.
          </span>
        </div>
      );
    }

    return bookmarksData?.map((item) => (
      <button
        key={item.bookmarkId}
        className={styles.HomeNoticeContent}
        onClick={() => handleNoticeClick(item)}
      >
        <span className={styles.HomeNoticeTitle}>{item.title}</span>
        <span className={styles.HomeNoticeDate}>{item.pubDate}</span>
      </button>
    ));
  };

  // TODO: 최신 공지사항 반영
  // const toSeeRecent = () => {
  //   setNoticeState("최신");
  // };

  return (
    <div className={styles.HomeNoticeWrapper}>
      <div className={styles.HomeNoticeCategoryWrapper}>
        <button
          className={`${styles.CategoryTitle} ${
            noticeState !== "북마크" ? styles.CategoryInactive : ""
          }`}
          onClick={toSeeBookmark}
        >
          북마크
        </button>
        {/* <button
          className={`${styles.CategoryTitle} ${
            noticeState !== "최신" ? styles.CategoryInactive : ""
          }`}
          onClick={toSeeRecent}
        >
          최신
        </button> */}
      </div>
      <div className={styles.HomeNoticeContentWrapper}>
        {renderContent()}
        {/* {noticeState === "북마크"
          ? dummyHomeBookMarkData.map((item, index) => (
              <div key={index} className={styles.HomeNoticeContent}>
                <span className={styles.HomeNoticeTitle}>{item.title}</span>
                <span className={styles.HomeNoticeDate}>{item.date}</span>
              </div>
            ))
          : dummyHomeRecentNoticeData.map((item, index) => (
              <div key={index} className={styles.HomeNoticeContent}>
                <span className={styles.HomeNoticeTitle}>{item.title}</span>
                <span className={styles.HomeNoticeDate}>{item.date}</span>
              </div>
            ))} */}
      </div>
    </div>
  );
};

export default HomeNotice;
