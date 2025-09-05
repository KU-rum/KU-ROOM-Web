import { useState, useEffect, useRef } from "react";
import type { TabIndicatorStyle } from "../types";

export const useTabIndicator = (activeTab: string, tabs: readonly string[]) => {
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<TabIndicatorStyle>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const activeTabIndex = tabs.indexOf(activeTab);
    const activeTabElement = tabsRef.current[activeTabIndex];

    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  useEffect(() => {
    tabsRef.current = Array(tabs.length).fill(null);
  }, [tabs]);

  return {
    tabsRef,
    indicatorStyle,
  };
};