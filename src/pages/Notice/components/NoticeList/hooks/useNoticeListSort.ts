import { useState, useEffect, useRef } from "react";
import type { NoticeResponse } from "@apis/notice";
import type { SortOption } from "../types";
import { sortNotices } from "../utils/sortUtils";
import { DEFAULT_SORT_ORDER } from "../constants";

export const useNoticeListSort = (notices: NoticeResponse[]) => {
  const [sortOrder, setSortOrder] = useState<SortOption>(DEFAULT_SORT_ORDER);
  const [showSort, setShowSort] = useState(false);
  const [sortedNotices, setSortedNotices] = useState<NoticeResponse[]>([]);
  const sortOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notices.length > 0) {
      const sorted = sortNotices(notices, sortOrder);
      setSortedNotices(sorted);
    } else {
      setSortedNotices([]);
    }
  }, [notices, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortOptionsRef.current &&
        !sortOptionsRef.current.contains(event.target as Node)
      ) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortOptionClick = (option: SortOption) => {
    setSortOrder(option);
    setShowSort(false);
  };

  return {
    sortOrder,
    showSort,
    setShowSort,
    sortedNotices,
    sortOptionsRef,
    handleSortOptionClick,
  };
};