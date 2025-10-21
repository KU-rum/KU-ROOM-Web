import { useState, useEffect, useRef } from "react";
import BottomBar from "@components/BottomBar/BottomBar";
import NoticeList from "../components/NoticeList/NoticeList";
import { NoticeHeader, NoticeTabs, ChatButton } from "./components";
import { useNotices } from "./hooks/useNotices";
import { useTabIndicator } from "./hooks/useTabIndicator";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";
import { NOTICE_TABS, NOTICE_CONFIG, NOTICE_MESSAGES } from "./constants";
import styles from "./Notice.module.css";

const Notice = () => {
  const [activeTab, setActiveTab] = useState<string>(NOTICE_CONFIG.DEFAULT_TAB);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { notices, loading, hasMore, loadNoticesByCategory, loadMoreNotices } = useNotices();
  const { tabsRef, indicatorStyle } = useTabIndicator(activeTab, NOTICE_TABS);
  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore: loadMoreNotices,
    hasMore,
    loading,
  });

  useEffect(() => {
    // 카테고리 변경 시 스크롤을 최상단으로 이동
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    loadNoticesByCategory(activeTab);
  }, [activeTab, loadNoticesByCategory]);

  return (
    <div className={styles["notice-container"]}>
      <NoticeHeader />
      <NoticeTabs
        tabs={NOTICE_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabsRef={tabsRef}
        indicatorStyle={indicatorStyle}
      />

      <div ref={scrollContainerRef} className={styles["scrollable-content"]}>
        <NoticeList
          notices={notices}
          loading={loading && notices.length === 0}
          loadingMore={loading && notices.length > 0}
          showBookmarkButton={false}
          showSortOptions={false}
          emptyMessage={NOTICE_MESSAGES.EMPTY_MESSAGE}
        />
        {hasMore && <div ref={loadMoreRef} style={{ height: "20px" }} />}
      </div>

      <ChatButton />

      <BottomBar />
    </div>
  );
};

export default Notice;
