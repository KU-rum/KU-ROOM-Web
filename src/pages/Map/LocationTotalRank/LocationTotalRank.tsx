import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { LocationTop3RankType } from "@apis/types";
import Header from "@components/Header/Header";
import { useLocationTotalRankQuery } from "@/queries";

import MyRankSection from "./components/MyRankSection/MyRankSection";
import TopRankSection from "./components/TopRankSection/TopRankSection";
import LowRankSection from "./components/LowRankSection/LowRankSection";
import TopRankModal from "./components/TopRankModal/TopRankModal";

import styles from "./LocationTotalRank.module.css";

const LocationTotalRank = () => {
  const { placeName } = useParams();
  const { state } = useLocation();
  const placeId = state?.placeId;

  // TODO: 추후 toast 및 접근 방지 추가
  // if (!placeId) {
  //   alert("장소 ID가 잘못되었습니다.");
  //   throw new Error();
  // }

  const {
    listBottomRef,
    top3RankData,
    totalRankData,
    myRankData,
    isPagePending,
  } = useLocationTotalRankQuery(placeId);

  const [modalState, setModalState] = useState(false);
  const [modalRankData, setModalRankData] = useState<
    LocationTop3RankType | undefined
  >(undefined);

  const handleOpenModal = (rankData: LocationTop3RankType) => {
    setModalState(true);
    setModalRankData(rankData);
  };
  const handleCloseModal = () => {
    setModalState(false);
    setModalRankData(undefined);
  };

  if (isPagePending) {
    // TODO:로딩 페이지 만들기
    return <div>로딩중...</div>;
  }

  return (
    <div>
      <Header>{placeName}</Header>
      <div className={styles.TotalRankingPageWrapper}>
        <TopRankSection
          top3RankData={top3RankData}
          handleOpenModal={handleOpenModal}
        />
        <LowRankSection
          totalRankData={totalRankData}
          listBottomRef={listBottomRef}
        />
      </div>
      <MyRankSection myRankData={myRankData} />
      <TopRankModal
        modalState={modalState}
        placeName={placeName}
        rankData={modalRankData}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default LocationTotalRank;
