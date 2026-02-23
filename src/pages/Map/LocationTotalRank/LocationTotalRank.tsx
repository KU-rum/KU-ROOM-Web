import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { LocationTop3RankType } from "@apis/types";
import Header from "@components/Header/Header";
import Loading from "@components/Loading/Loading";
import { useLocationTotalRankQuery } from "@/queries";

import MyRankSection from "./components/MyRankSection/MyRankSection";
import TopRankSection from "./components/TopRankSection/TopRankSection";
import LowRankSection from "./components/LowRankSection/LowRankSection";
import TopRankModal from "./components/TopRankModal/TopRankModal";
import { MapLayoutContext } from "../layout/MapLayout";

import styles from "./LocationTotalRank.module.css";

const LocationTotalRank = () => {
  const navigate = useNavigate();
  const { placeName } = useParams();
  const { detailLocationPlaceId } = useOutletContext<MapLayoutContext>();

  const [modalState, setModalState] = useState(false);
  const [modalRankData, setModalRankData] = useState<
    LocationTop3RankType | undefined
  >(undefined);

  const {
    listBottomRef,
    top3RankData,
    totalRankData,
    myRankData,
    isPagePending,
  } = useLocationTotalRankQuery(detailLocationPlaceId);

  useEffect(() => {
    if (!detailLocationPlaceId) {
      navigate("/map");
      return;
    }
  }, [detailLocationPlaceId, navigate]);

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
    return <Loading />;
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
