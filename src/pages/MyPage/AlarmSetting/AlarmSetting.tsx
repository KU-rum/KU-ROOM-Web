import { useEffect, useState, useRef } from "react";

import useToast from "@hooks/use-toast";
import { getKeywordsApi, registerKeywordApi } from "@apis/search";
import Header from "@components/Header/Header";
import Loading from "@components/Loading/Loading";

import ProfileSection from "@pages/MyPage/components/ProfileSection/ProfileSection";
import ToggleAlarmButton from "@pages/MyPage/components/ToggleAlarmButton";
import { ALARM_SECTION_DATA } from "@pages/MyPage/AlarmSetting/constant";

import { useAlarmSettings } from "./hooks/use-alarm-settings";
import styles from "./AlarmSetting.module.css";

const AlarmSetting = () => {
  const toast = useToast();
  const [keywords, setKeywords] = useState<{ keyword: string }[]>([]);
  const hasLoadedKeywords = useRef(false);

  const {
    isAllAlarmOn,
    toggleStates,
    isPendingAlarmActiveStatus,
    handleToggle,
    handleToggleAll,
  } = useAlarmSettings();

  useEffect(() => {
    const loadKeywords = async () => {
      if (hasLoadedKeywords.current) return;
      hasLoadedKeywords.current = true;

      try {
        const keywordList = await getKeywordsApi();
        setKeywords(keywordList.map((keyword: string) => ({ keyword })));
      } catch (error) {
        console.error("키워드 조회 실패:", error);
      }
    };

    loadKeywords();
  }, []);

  if (isPendingAlarmActiveStatus) {
    return <Loading />;
  }

  const handleDeleteKeyword = async (target: string) => {
    try {
      await registerKeywordApi(target);
      setKeywords((prev) => prev.filter((k) => k.keyword !== target));
      toast.info("키워드가 삭제되었어요");
    } catch (error) {
      console.error("키워드 삭제 실패:", error);
      toast.error("키워드 삭제에 실패했어요");
    }
  };

  return (
    <div>
      <Header>알림 설정</Header>
      <div className={styles.AlarmSettingPage}>
        <div className={styles.EntireAlarmToggleSection}>
          <span className={styles.SectionTitle}>전체</span>
          <div className={styles.ContentWrapper}>
            <span className={styles.ContentName}>전체 알림</span>
            <ToggleAlarmButton isOn={isAllAlarmOn} onToggle={handleToggleAll} />
          </div>
        </div>
        {ALARM_SECTION_DATA.map((data, index) => (
          <ProfileSection
            key={index}
            sectionData={{
              title: data.title,
              contents: data.contents.map((item) => item.name),
            }}
            isLastSection={index === ALARM_SECTION_DATA.length - 1}
            isToggle={true}
            toggleStates={toggleStates}
            onToggle={handleToggle}
            keywordData={keywords}
            onDeleteKeyword={handleDeleteKeyword}
          />
        ))}
      </div>
    </div>
  );
};

export default AlarmSetting;
