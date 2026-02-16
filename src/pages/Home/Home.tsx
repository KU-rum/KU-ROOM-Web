// 홈 페이지
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { checkIsSharedApi } from "@apis/map";
import { clearAuthStorage } from "@utils/storageUtils";
// import Splash from "@components/Splash";
import BottomBar from "@components/BottomBar/BottomBar";
import Header from "@components/Header/Header";
import ShareLocationModal from "@components/ShareLocationModal/ShareLocationModal";

import HomeMenu from "./components/HomeMenu/HomeMenu";
import HomeMiniMap from "./components/HomeMiniMap/HomeMiniMap";
import HomeSildeBanner from "./components/HomeSlideBanner/HomeSildeBanner";
import FriendLocation from "./components/FriendLocation/FriendLocation";
import HomeRanking from "./components/HomeRanking/HomeRanking";
import HomeNotice from "./components/HomeNotice/HomeNotice";
import styles from "./Home.module.css";
import { useUnreadAlarm } from "../Alarm/hooks/use-unread-alarm";

const Home = () => {
  const navigate = useNavigate();
  const { unreadAlarmData } = useUnreadAlarm();
  // const [showSplash, setShowSplash] = useState(true);
  const [isSharedLocation, setIsSharedLocation] = useState(false); // 내 위치 공유상태인지 아닌지
  const [sharedLocationName, setSharedLocationName] = useState<string | null>(
    null,
  );
  // 공유 상태 확인 트리거 키
  const [locationSharedRefreshKey, setLocationSharedRefreshKey] = useState(0);

  // 내 위치 공유 버튼 모달 상태
  const [shareModalState, setShareModalState] = useState(false);

  // 현재 내 위치 공유 상태 확인 함수
  const getIsMySharedInfo = async () => {
    try {
      const response = await checkIsSharedApi();
      console.log("현재 내 위치 공유 상태 : ", response);
      setIsSharedLocation(response.isActive);
      setSharedLocationName(response.placeName);
    } catch (error) {
      console.error("위치 공유 상태 확인 실패 : ", error);
    }
  };

  useEffect(() => {
    getIsMySharedInfo();
  }, [locationSharedRefreshKey, isSharedLocation]);

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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>로그인 처리 중...</div>
      </div>
    );
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
          setModalState={setShareModalState}
          sharedLocationName={sharedLocationName}
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
        refreshSharedStatus={() =>
          setLocationSharedRefreshKey((prev) => prev + 1)
        }
      />
    </div>
  );
};

export default Home;
