import Header from "@components/Header/Header";
import { getProfileChangeSectionData } from "@constant/sectionDatas";
import { useUserStore } from "@stores/userStore";

import MyProfileComponent from "../components/MyProfileComponent/MyProfileComponent";
import ProfileSection from "../components/ProfileSection/ProfileSection";
import styles from "./ProfileChange.module.css";

const ProfileChange = () => {
  const loginType = useUserStore((state) => state.user?.loginType);
  if (!loginType) return;
  const sectionData = getProfileChangeSectionData(loginType);

  return (
    <div>
      <Header>프로필 설정</Header>
      <div className={styles.ProfileChangePageWrapper}>
        <MyProfileComponent isChangeProfile={true} />
        <div className={styles.DivideSectionThick} />
        {sectionData.map((data, index) => (
          <ProfileSection
            key={index}
            sectionData={data}
            isLastSection={index === sectionData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileChange;
