// 홈 페이지
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { clearAuthStorage } from "@utils/storageUtils";
import { useCheckShareStatusQuery, useUnreadAlarmQuery } from "@/queries";
import BottomBar from "@components/BottomBar/BottomBar";
import Header from "@components/Header/Header";
import ShareLocationModal from "@components/ShareLocationModal/ShareLocationModal";
import Loading from "@components/Loading/Loading";

import HomeMenu from "./components/HomeMenu/HomeMenu";
import HomeMiniMap from "./components/HomeMiniMap/HomeMiniMap";
import HomeSildeBanner from "./components/HomeSlideBanner/HomeSildeBanner";
import FriendLocation from "./components/FriendLocation/FriendLocation";
import HomeRanking from "./components/HomeRanking/HomeRanking";
import HomeNotice from "./components/HomeNotice/HomeNotice";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const { unreadAlarmData } = useUnreadAlarmQuery();
  const {
    isSharedLocation,
    sharedLocationName,
    isPendingShareStatus,
    isErrorShareStatus,
  } = useCheckShareStatusQuery();

  // 내 위치 공유 버튼 모달 상태
  const [shareModalState, setShareModalState] = useState(false);

  // 로그인 여부 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      clearAuthStorage();
      navigate("/login");
      return;
    }
  }, [navigate]);

  // 토큰이 없으면 로딩 화면 표시
  const hasToken = localStorage.getItem("accessToken");

  if (!hasToken) {
    return <Loading />;
  }

  return (
    <div>
      <Header
        hasUnread={unreadAlarmData?.hasUnread}
        unreadCount={unreadAlarmData?.count}
      >
        홈
      </Header>
      <div className={styles.HomeContentWrapper}>
        <HomeSildeBanner />
        <HomeMenu />
        <HomeMiniMap
          isSharedLocation={isSharedLocation}
          sharedLocationName={sharedLocationName}
          isLoading={isPendingShareStatus}
          isError={isErrorShareStatus}
          setModalState={setShareModalState}
        />
        <FriendLocation userSharedLocation={sharedLocationName} />
        <HomeRanking />
        <HomeNotice />
      </div>
      <BottomBar />
      <ShareLocationModal
        modalState={shareModalState}
        isSharedLocation={isSharedLocation}
        setModalState={setShareModalState}
      />
    </div>
  );
};

export default Home;
