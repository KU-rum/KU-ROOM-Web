import { useState } from "react";

import Header from "@components/Header/Header";

import { SearchInput } from "./Components/SearchInput";
import { SearchHistory } from "./Components/SearchHistory";
import { TagButtons } from "./Components/TagButtons";
import { NoticeList } from "./Components/NoticeList";
import { SearchResult } from "./Components/SearchResult";
import { NotificationBadge } from "./Components/NotificationBadge";
import { LoadingState } from "../components/NoticeList/components/LoadingState/LoadingState";
import { EmptyState } from "../components/NoticeList/components/EmptyState/EmptyState";
import {
  usePopularNoticesQuery,
  usePrimaryNoticesQuery,
  useSearchNoticesQuery,
  useRecentSearchesQuery,
  useKeywordsQuery,
  useRecentSearchMutation,
  useKeywordMutation,
} from "@/queries";
import styles from "./Search.module.css";

const Search = () => {
  const [searchText, setSearchText] = useState("");

  // 데이터 조회 쿼리
  const { data: popularNotices = [], isPending: isPendingPopular } =
    usePopularNoticesQuery();
  const { data: primaryNotices = [], isPending: isPendingPrimary } =
    usePrimaryNoticesQuery();
  const { searchResult, isPending: isPendingSearch } =
    useSearchNoticesQuery(searchText);
  const { data: recentSearches = [] } = useRecentSearchesQuery();
  const { data: subscribedKeywords = [] } = useKeywordsQuery();

  // 뮤테이션
  const { saveSearch, deleteSearch, deleteAllSearches } =
    useRecentSearchMutation();
  const { toggleKeyword } = useKeywordMutation();

  const handleTagClick = (tag: string) => {
    setSearchText(tag);
  };

  const handleRemoveSearchTerm = (term: string) => {
    const target = recentSearches.find((s) => s.keyword === term);
    if (target) {
      deleteSearch(target.id);
    }
  };

  const handleSelectSearchTerm = (term: string) => {
    setSearchText(term);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      saveSearch(text);
    }
  };

  const navigateToNoticeDetail = (noticeId: number) => {
    const allNotices = [...popularNotices, ...primaryNotices, ...searchResult];
    const notice = allNotices.find((n) => n.id === noticeId);
    if (notice?.link) {
      window.open(notice.link, "_blank");
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
            searchTerms={recentSearches.map((s) => s.keyword)}
            onRemoveTerm={handleRemoveSearchTerm}
            onSelectTerm={handleSelectSearchTerm}
            onClearHistory={deleteAllSearches}
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
          {isPendingPopular ? (
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
          {isPendingPrimary ? (
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
            onToggle={() => toggleKeyword(searchText)}
          />
          <SearchResult
            filteredNotices={searchResult}
            onItemClick={navigateToNoticeDetail}
            isLoading={isPendingSearch}
          />
        </>
      )}
    </div>
  );
};

export default Search;
