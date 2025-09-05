import { useState, useEffect } from "react";

import Header from "@components/Header/Header";

import { SearchInput } from "./Components/SearchInput";
import { SearchHistory } from "./Components/SearchHistory";
import { TagButtons } from "./Components/TagButtons";
import { NoticeList } from "./Components/NoticeList";
import { SearchResult } from "./Components/SearchResult";
import { NotificationBadge } from "./Components/NotificationBadge";
import { getNotices } from "../../../apis/notice";
import type { NoticeItem } from "../types/noticeTypes";
import styles from "./Search.module.css";

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<NoticeItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "입학식",
    "수강 신청",
    "장학금",
  ]);
  const [subscribedKeywords, setSubscribedKeywords] = useState<string[]>([]);
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(true);

  useEffect(() => {
    const loadAllNotices = async () => {
      try {
        // 여러 카테고리에서 공지사항 가져오기
        const categories = [234, 235, 237, 238, 240, 4083, 4214, 4274];
        const allNoticesPromises = categories.map(categoryId => 
          getNotices({ categoryId, size: 5 })
        );
        const responses = await Promise.all(allNoticesPromises);
        const allNotices = responses.flat();
        setNotices(allNotices);
        setFilteredNotices(allNotices);
      } catch (error) {
        console.error('공지사항 로드 실패:', error);
      }
    };

    loadAllNotices();
  }, []);

  useEffect(() => {
    // 검색어에 따라 공지사항 필터링
    let filtered = notices;

    if (searchText) {
      filtered = filtered.filter((notice) =>
        notice.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredNotices(filtered);
  }, [searchText, notices]);

  const handleTagClick = (tag: string) => {
    setSearchText(tag);

    // 검색 히스토리에 추가
    if (isHistoryEnabled && !searchHistory.includes(tag)) {
      setSearchHistory((prev) => [tag, ...prev].slice(0, 10));
    }
  };

  const handleRemoveSearchTerm = (term: string) => {
    setSearchHistory((prev) => prev.filter((t) => t !== term));
  };

  const handleSelectSearchTerm = (term: string) => {
    // 최근 검색어 태그 클릭 시 검색창에 입력하고 검색 실행
    setSearchText(term);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    // 검색어가 있고, 엔터 등의 검색 이벤트가 발생했을 때 히스토리에 추가
    if (text && isHistoryEnabled && !searchHistory.includes(text)) {
      setSearchHistory((prev) => [text, ...prev].slice(0, 10)); // 최대 10개 유지
    }
  };

  const navigateToNoticeDetail = (noticeId: number) => {
    const notice = notices.find(n => n.id === noticeId);
    if (notice?.link) {
      window.open(notice.link, '_blank');
    }
  };

  const handleToggleNotification = (keyword: string) => {
    setSubscribedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((k) => k !== keyword);
      }
      return [...prev, keyword];
    });
  };

  const handleToggleHistory = () => {
    setIsHistoryEnabled((prev) => !prev);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // 검색어가 있으면 검색 결과만 표시
  const isSearching = searchText.length > 0;

  return (
    <div className={styles.container}>
      <Header>검색</Header>

      <SearchInput
        value={searchText}
        onChange={setSearchText}
        onSearch={handleSearch}
      />

      {!isSearching ? (
        <>
          <SearchHistory
            searchTerms={searchHistory}
            onRemoveTerm={handleRemoveSearchTerm}
            onSelectTerm={handleSelectSearchTerm}
            isHistoryEnabled={isHistoryEnabled}
            onToggleHistory={handleToggleHistory}
            onClearHistory={handleClearHistory}
          />

          <h2 className={styles.sectionTitle}>추천 검색어</h2>
          <TagButtons
            tags={[
              "교환학생",
              "장학금",
              "수강신청",
              "수강바구니",
              "다전공",
              "졸업유예",
            ]}
            selectedTags={[]} // 추천 검색어에서는 선택 상태가 없음
            onTagClick={handleTagClick}
          />

          <h2 className={styles.sectionTitle}>인기 공지</h2>
          <NoticeList
            notices={notices.slice(0, 3)}
            onItemClick={(noticeId: number) => navigateToNoticeDetail(noticeId)}
          />

          <h2 className={styles.sectionTitle}>주요 공지</h2>
          <NoticeList
            notices={notices.slice(5, 8)}
            onItemClick={(noticeId: number) => navigateToNoticeDetail(noticeId)}
          />
        </>
      ) : (
        <>
          <NotificationBadge
            keyword={searchText}
            isSubscribed={subscribedKeywords.includes(searchText)}
            onToggle={() => handleToggleNotification(searchText)}
          />
          <SearchResult
            filteredNotices={filteredNotices}
            onItemClick={navigateToNoticeDetail}
          />
        </>
      )}
    </div>
  );
};

export default Search;
