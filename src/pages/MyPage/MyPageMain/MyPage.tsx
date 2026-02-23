// 마이페이지
import { useState } from "react";

import BottomBar from "@components/BottomBar/BottomBar";
import Header from "@components/Header/Header";
import { MyPageSectionData } from "@constant/sectionDatas";

import ProfileSection from "../components/ProfileSection/ProfileSection";
import ProfileModal from "./components/ProfileModal/ProfileModal";
import MyProfileComponent from "../components/MyProfileComponent/MyProfileComponent";

import styles from "./MyPage.module.css";

const MyPage = () => {
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState("");

  return (
    <>
      <Header>마이페이지</Header>
      <div className={styles.MyPageContentWrapper}>
        <MyProfileComponent isChangeProfile={false} />
        <div className={styles.DivideSectionThick} />
        {MyPageSectionData.map((data, index) => (
          <ProfileSection
            key={index}
            sectionData={data}
            isLastSection={index === MyPageSectionData.length - 1}
            setModalType={setModalType}
            setModalState={setModalState}
          />
        ))}
      </div>

      <BottomBar />
      <ProfileModal
        modalState={modalState}
        modalType={modalType}
        setModalState={setModalState}
      />
    </>
  );
};

export default MyPage;
