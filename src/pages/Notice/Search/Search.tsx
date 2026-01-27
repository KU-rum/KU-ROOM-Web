import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@components/Header/Header";
import useToast from "@/shared/hooks/use-toast";

import { SearchInput } from "./Components/SearchInput";
import { SearchHistory } from "./Components/SearchHistory";
import { TagButtons } from "./Components/TagButtons";
import { NoticeList } from "./Components/NoticeList";
import { SearchResult } from "./Components/SearchResult";
import { NotificationBadge } from "./Components/NotificationBadge";
import { LoadingState } from "../components/NoticeList/components/LoadingState/LoadingState";
import { EmptyState } from "../components/NoticeList/components/EmptyState/EmptyState";
import {
  registerKeyword,
  getKeywords,
  searchNotices,
  getRecentSearches,
  deleteRecentSearch,
  deleteAllRecentSearches,
  saveRecentSearch,
  type RecentSearch,
} from "../../../apis/search";
import { getPopularNotices, getPrimaryNotices } from "../../../apis/notice";
import type { NoticeResponse } from "@apis/notice";
import styles from "./Search.module.css";

const Search: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchText, setSearchText] = useState("");
  const [popularNotices, setPopularNotices] = useState<NoticeResponse[]>([]);
  const [primaryNotices, setPrimaryNotices] = useState<NoticeResponse[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<NoticeResponse[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [subscribedKeywords, setSubscribedKeywords] = useState<string[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [isLoadingPrimary, setIsLoadingPrimary] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const hasLoadedData = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (hasLoadedData.current) return;
      hasLoadedData.current = true;

      try {
        // 키워드 조회
        const keywords = await getKeywords();
        setSubscribedKeywords(keywords);

        // 최근 검색어 조회
        try {
          const searches = await getRecentSearches(20);
          setRecentSearches(searches);
        } catch (error) {
          console.error("최근 검색어 조회 실패:", error);
        }

        // 북마크 기준 인기 공지사항 조회
        setIsLoadingPopular(true);
        try {
          const popular = await getPopularNotices();
          setPopularNotices(popular);
        } catch (error) {
          console.error("인기 공지사항 조회 실패:", error);
          toast.error("인기 공지를 불러오지 못했어요");
        } finally {
          setIsLoadingPopular(false);
        }

        // 주요 공지사항 조회
        setIsLoadingPrimary(true);
        try {
          const primary = await getPrimaryNotices();
          setPrimaryNotices(primary);
        } catch (error) {
          console.error("주요 공지사항 조회 실패:", error);
          toast.error("주요 공지를 불러오지 못했어요");
        } finally {
          setIsLoadingPrimary(false);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    loadData();
  }, [toast]);

  useEffect(() => {
    if (!searchText) {
      setFilteredNotices([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoadingSearch(true);
      try {
        const response = await searchNotices({ keyword: searchText });
        setFilteredNotices(response.content);
      } catch (error) {
        console.error("검색 실패:", error);
        toast.error("검색에 실패했어요");
        setFilteredNotices([]);
      } finally {
        setIsLoadingSearch(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleTagClick = (tag: string) => {
    setSearchText(tag);
  };

  const handleRemoveSearchTerm = async (term: string) => {
    const searchToDelete = recentSearches.find((search) => search.keyword === term);
    if (!searchToDelete) return;

    try {
      await deleteRecentSearch(searchToDelete.id);
      setRecentSearches((prev) => prev.filter((search) => search.keyword !== term));
    } catch (error) {
      console.error("최근 검색어 삭제 실패:", error);
      toast.error("검색어 삭제에 실패했어요");
    }
  };

  const handleSelectSearchTerm = (term: string) => {
    setSearchText(term);
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text) {
      try {
        await saveRecentSearch(text);
        const searches = await getRecentSearches(20);
        setRecentSearches(searches);
      } catch (error) {
        console.error("최근 검색어 저장 실패:", error);
      }
    }
  };

  const navigateToNoticeDetail = (noticeId: number) => {
    const allNotices = [
      ...popularNotices,
      ...primaryNotices,
      ...filteredNotices,
    ];
    const notice = allNotices.find((n) => n.id === noticeId);
    if (notice) {
      navigate(`/notice/${notice.categoryName}/${notice.id}`);
    }
  };

  const handleToggleNotification = async (keyword: string) => {
    try {
      const response = await registerKeyword(keyword);

      if (response.code === 200) {
        const isRemoving = subscribedKeywords.includes(keyword);

        setSubscribedKeywords((prev) => {
          if (prev.includes(keyword)) {
            return prev.filter((k) => k !== keyword);
          }
          return [...prev, keyword];
        });

        if (isRemoving) {
          toast.info("키워드 알림이 해제되었어요");
        } else {
          toast.info("키워드 알림이 등록되었어요");
        }
      }
    } catch (error) {
      console.error("키워드 등록/해제 실패:", error);
      toast.error("키워드 설정에 실패했어요");
    }
  };

  const handleClearHistory = async () => {
    try {
      await deleteAllRecentSearches();
      setRecentSearches([]);
    } catch (error) {
      console.error("최근 검색어 전체 삭제 실패:", error);
      toast.error("검색어 삭제에 실패했어요");
    }
  };

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
            searchTerms={recentSearches.map((search) => search.keyword)}
            onRemoveTerm={handleRemoveSearchTerm}
            onSelectTerm={handleSelectSearchTerm}
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
            selectedTags={[]}
            onTagClick={handleTagClick}
          />

          <h2 className={styles.sectionTitle}>인기 공지</h2>
          {isLoadingPopular ? (
            <LoadingState />
          ) : popularNotices.length === 0 ? (
            <EmptyState message="인기 공지가 없어요" />
          ) : (
            <NoticeList
              notices={popularNotices}
              onItemClick={(noticeId: number) =>
                navigateToNoticeDetail(noticeId)
              }
            />
          )}

          <h2 className={styles.sectionTitle}>주요 공지</h2>
          {isLoadingPrimary ? (
            <LoadingState />
          ) : primaryNotices.length === 0 ? (
            <EmptyState message="주요 공지가 없어요" />
          ) : (
            <NoticeList
              notices={primaryNotices}
              onItemClick={(noticeId: number) =>
                navigateToNoticeDetail(noticeId)
              }
            />
          )}
          <div className={styles.bottomSpacer} />
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
            isLoading={isLoadingSearch}
          />
        </>
      )}
    </div>
  );
};

export default Search;
