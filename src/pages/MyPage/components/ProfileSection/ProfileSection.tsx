import React from "react";

import arrowRight from "@assets/nav/arrowRight.svg";
import { AppVersion } from "@constant/appInfo";
import { EmptyState } from "@pages/Notice/components/NoticeList/components/EmptyState/EmptyState";

import ToggleAlarmButton from "../ToggleAlarmButton";
import KeywordButton from "../KeywordButton/KeywordButton";
import { useHandleSectionClick } from "../../hooks/use-handle-section-click";
import { useUserProfile } from "../../hooks/use-user-profile";

import styles from "./ProfileSection.module.css";

interface ProfileSectionProps {
  sectionData: {
    title: string;
    contents: string[];
  };
  isLastSection: boolean;
  isToggle?: boolean;
  toggleStates?: Record<string, boolean>;
  onToggle?: (item: string) => void;
  keywordData?: { keyword: string }[];
  onDeleteKeyword?: (keyword: string) => void;
  setModalType?: (value: string) => void;
  setModalState?: (value: boolean) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  sectionData,
  isLastSection,
  isToggle,
  toggleStates,
  onToggle,
  keywordData,
  onDeleteKeyword,
  setModalType,
  setModalState,
}) => {
  const { userProfileData } = useUserProfile();

  const handleSectionClick = useHandleSectionClick(setModalType, setModalState);
  return (
    <>
      <div className={styles.SectionContainer}>
        <span className={styles.SectionTitle}>{sectionData.title}</span>
        {sectionData.contents.map((item, index) => (
          <React.Fragment key={item + index}>
            <button
              key={index}
              className={`${styles.SectionContentButton} ${
                isToggle ? styles.ToggleButtonStyle : ""
              }`}
              onClick={() => !isToggle && handleSectionClick(item)}
              disabled={
                item === "이메일" ||
                item === "아이디" ||
                item === "학번" ||
                item === "앱버전"
              }
            >
              {item}
              {item === "이메일" && (
                <span className={styles.ExtraInfoText}>
                  {userProfileData?.email}
                </span>
              )}
              {item === "아이디" && (
                <span className={styles.ExtraInfoText}>
                  {userProfileData?.loginId}
                </span>
              )}
              {item === "학번" && (
                <span className={styles.ExtraInfoText}>
                  {userProfileData?.studentId}
                </span>
              )}
              {item === "학과" && (
                <img className={styles.ArrowIcon} src={arrowRight} alt="학과" />
              )}
              {item === "앱버전" && (
                <span className={styles.ExtraInfoText}>{AppVersion}</span>
              )}
              {isToggle && (
                <ToggleAlarmButton
                  isOn={toggleStates?.[item] ?? false} // undefined면 false로 처리
                  onToggle={() => onToggle?.(item)}
                />
              )}
            </button>
            {item === "공지 키워드 알림" &&
              toggleStates?.[item] &&
              keywordData && (
                <div className={styles.KeywordButtonWrapper} style={{}}>
                  {keywordData.length === 0 ? (
                    <div className={styles.EmptyWrapper}>
                      <EmptyState message="등록된 키워드가 없어요" />
                    </div>
                  ) : (
                    keywordData.map((item, index) => (
                      <KeywordButton
                        key={index}
                        keyword={item.keyword}
                        handleDelete={() => onDeleteKeyword?.(item.keyword)}
                      />
                    ))
                  )}
                </div>
              )}
          </React.Fragment>
        ))}
      </div>
      {!isLastSection && <div className={styles.DivideSectionThin} />}
    </>
  );
};

export default ProfileSection;
