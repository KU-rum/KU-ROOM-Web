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

import "./Header.css";

interface HeaderProps {
  children?: React.ReactNode;
  hasNewAlarm?: boolean;
  onBookmarkClick?: () => void;
  isBookmarked?: boolean;
}

const renderHeaderContent = (
  children: React.ReactNode,
  newAlarmState: boolean,
  navigate: ReturnType<typeof useNavigate>,
  onBookmarkClick?: () => void,
  isBookmarked?: boolean
) => {
  switch (children) {
    case "홈":
      return (
        <div className="home-header-wrapper">
          <h1 className="home-header-title">KURUM</h1>
          <div style={{ position: "relative" }}>
            <img
              src={homeAlarmIcon}
              alt="알림"
              onClick={() => navigate("/alarm")}
            />
            {newAlarmState ? <div className="new-alarm-marker" /> : <></>}
          </div>
        </div>
      );
    case "공지사항":
      return (
        <div className="notice-header-content-wrapper">
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
            className="profilechange-header-content"
            src={arrowBackIcon}
            alt="뒤로가기"
            onClick={() => navigate(-1)}
          />
          <img
            className="header-info-button-icon"
            src={infoButtonIcon}
            alt="툴팁 트리거 버튼"
            data-tooltip-id="my-location-ranking"
            data-tooltip-place="bottom-end"
          />
          <Tooltip
            id="my-location-ranking"
            content={`1시간 이상 위치 공유를 유지해야\n1회로 인정됩니다.`}
            place="bottom-end"
            offset={10}
            style={{
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
      return (
        <>
          <img
            className="profilechange-header-content"
            src={arrowBackIcon}
            alt="뒤로가기"
            onClick={() => navigate(-1)}
          />
          <img
            className="header-kuroom-icon"
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
              className="profilechange-header-content"
              src={arrowBackIcon}
              alt="뒤로가기"
              onClick={() => navigate(-1)}
            />
            <img
              className="notice-detail-bookmark-icon"
              src={isBookmarked ? bookmarkFillIcon : bookmarkIcon}
              alt={isBookmarked ? "북마크됨" : "북마크"}
              onClick={onBookmarkClick}
            />
          </>
        );
      }

      return (
        <img
          className="profilechange-header-content"
          src={arrowBackIcon}
          alt="뒤로가기"
          onClick={() => navigate(-1)}
        />
      );
  }
};

const Header: React.FC<HeaderProps> = ({
  children = "",
  hasNewAlarm,
  onBookmarkClick,
  isBookmarked,
}) => {
  const navigate = useNavigate();
  const newAlarmState = children === "홈" && hasNewAlarm === true;

  return (
    <>
      <header className="header-container">
        {children === "홈" ? (
          <></>
        ) : (
          <span className="header-title">{children}</span>
        )}
        {renderHeaderContent(
          children,
          newAlarmState,
          navigate,
          onBookmarkClick,
          isBookmarked
        )}
      </header>
    </>
  );
};

export default Header;
