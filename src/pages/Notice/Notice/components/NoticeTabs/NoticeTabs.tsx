import type { TabIndicatorStyle } from "../../types";
import styles from "./NoticeTabs.module.css";

interface NoticeTabsProps {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabsRef: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  indicatorStyle: TabIndicatorStyle;
}

export const NoticeTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  tabsRef, 
  indicatorStyle 
}: NoticeTabsProps) => {
  return (
    <div className={styles["category-section"]}>
      <div className={styles["notice-tabs-container"]}>
        <div className={styles["notice-tabs"]}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              className={`${styles["notice-tab"]} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => onTabChange(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          className={styles["active-tab-indicator"]}
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};