import { useState, useEffect } from "react";
import BottomBar from "@components/BottomBar/BottomBar";
import NoticeList from "../components/NoticeList/NoticeList";
import { NoticeHeader, NoticeTabs, ChatButton } from "./components";
import { useNotices } from "./hooks/useNotices";
import { useTabIndicator } from "./hooks/useTabIndicator";
import { NOTICE_TABS, NOTICE_CONFIG, NOTICE_MESSAGES } from "./constants";
import styles from "./Notice.module.css";

const Notice = () => {
  const [activeTab, setActiveTab] = useState<string>(NOTICE_CONFIG.DEFAULT_TAB);
  const { notices, loading, loadNoticesByCategory } = useNotices();
  const { tabsRef, indicatorStyle } = useTabIndicator(activeTab, NOTICE_TABS);

  useEffect(() => {
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

      <div className={styles["scrollable-content"]}>
        <NoticeList
          notices={notices}
          loading={loading}
          showBookmarkButton={false}
          showSortOptions={false}
          emptyMessage={NOTICE_MESSAGES.EMPTY_MESSAGE}
        />
      </div>

      <ChatButton />

      <BottomBar />
    </div>
  );
};

export default Notice;