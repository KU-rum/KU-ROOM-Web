import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import bookmarkIcon from "@/assets/headericon/bookmark.svg";
import bookmarkFillIcon from "@/assets/headericon/bookmark-fill.svg";
import searchIcon from "@/assets/headericon/search.svg";
import arrowBackIcon from "@/assets/nav/arrowback.svg";
import kuroomIcon from "@/assets/icon/cloud.svg";
import homeAlarmIcon from "@/assets/icon/homealarm.svg";
import infoButtonIcon from "@/assets/icon/info-button.svg";

import styles from "./Header.module.css";

interface HeaderProps {
  children?: React.ReactNode;
  hasUnread?: boolean;
  unreadCount?: number;
  onBookmarkClick?: () => void;
  isBookmarked?: boolean;
  onlyIcon?: boolean;
}

const renderHeaderContent = (
  children: React.ReactNode,
  hasUnreadAlarm: boolean,
  navigate: ReturnType<typeof useNavigate>,
  unreadCount?: number,
  onBookmarkClick?: () => void,
  isBookmarked?: boolean,
  onlyIcon?: boolean,
) => {
  switch (children) {
    case "홈":
      return (
        <div className={styles["home-header-wrapper"]}>
          <h1 className={styles["home-header-title"]}>KUROOM</h1>
          <div style={{ position: "relative" }}>
            <img
              src={homeAlarmIcon}
              alt="알림"
              onClick={() => navigate("/alarm")}
            />
            {hasUnreadAlarm && unreadCount ? (
              <span className={styles["new-alarm-marker"]}>
                {unreadCount <= 99 ? unreadCount : "99+"}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    case "공지사항":
      return (
        <div className={styles["notice-header-content-wrapper"]}>
          <img
            src={bookmarkIcon}
            alt="북마크"
            onClick={() => navigate("/bookmark")}
          />
          <img
            src={searchIcon}
            alt="검색"
            onClick={() => navigate("/search")}
          />
        </div>
      );
    case "내 장소 랭킹":
      return (
        <>
          <img
            className={styles["profilechange-header-content"]}
            src={arrowBackIcon}
            alt="뒤로가기"
            onClick={() => navigate(-1)}
          />
          <img
            className={styles["header-info-button-icon"]}
            src={infoButtonIcon}
            alt="툴팁 트리거 버튼"
            data-tooltip-id="my-location-ranking"
            data-tooltip-place="bottom-end"
          />
          <Tooltip
            id="my-location-ranking"
            content={`1시간 이상 위치 공유를 유지해야 1회로 인정되며 해제 여부와 관계 없이 00시에는 자동 해제됩니다.`}
            place="bottom-end"
            offset={10}
            style={{
              width: "236px",
              boxSizing: "border-box",
              wordBreak: "keep-all",
              background: "#1D2228",
              padding: "10px 17px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "140%",
              whiteSpace: "break-spaces",
            }}
          />
        </>
      );
    case "":
      return onlyIcon ? (
        <>
          <img
            className={styles["header-kuroom-icon"]}
            src={kuroomIcon}
            alt="쿠룸 아이콘"
          />
        </>
      ) : (
        <>
          <img
            className={styles["profilechange-header-content"]}
            src={arrowBackIcon}
            alt="뒤로가기"
            onClick={() => navigate(-1)}
          />
          <img
            className={styles["header-kuroom-icon"]}
            src={kuroomIcon}
            alt="쿠룸 아이콘"
          />
        </>
      );
    default:
      // 공지사항 상세보기 등 북마크 기능이 필요한 경우
      if (onBookmarkClick) {
        return (
          <>
            <img
              className={styles["profilechange-header-content"]}
              src={arrowBackIcon}
              alt="뒤로가기"
              onClick={() => navigate(-1)}
            />
            <img
              className={styles["notice-detail-bookmark-icon"]}
              src={isBookmarked ? bookmarkFillIcon : bookmarkIcon}
              alt={isBookmarked ? "북마크됨" : "북마크"}
              onClick={onBookmarkClick}
            />
          </>
        );
      }

      return (
        <img
          className={styles["profilechange-header-content"]}
          src={arrowBackIcon}
          alt="뒤로가기"
          onClick={() => navigate(-1)}
        />
      );
  }
};

const Header: React.FC<HeaderProps> = ({
  children = "",
  hasUnread,
  unreadCount,
  onBookmarkClick,
  isBookmarked,
  onlyIcon = false,
}) => {
  const navigate = useNavigate();
  const hasUnreadAlarm = children === "홈" && hasUnread === true;

  return (
    <>
      <header
        className={styles["header-container"]}
        style={children === "알림" ? { backgroundColor: "white" } : {}}
      >
        {children === "홈" ? (
          <></>
        ) : (
          <span className={styles["header-title"]}>{children}</span>
        )}
        {renderHeaderContent(
          children,
          hasUnreadAlarm,
          navigate,
          unreadCount,
          onBookmarkClick,
          isBookmarked,
          onlyIcon,
        )}
      </header>
    </>
  );
};

export default Header;
