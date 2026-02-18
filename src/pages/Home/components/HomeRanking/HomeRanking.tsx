import { useNavigate } from "react-router-dom";

import arrowRight from "@assets/nav/arrowRight.svg";
import rank1Icon from "@assets/icon/ranking/rank1.png";
import rank2Icon from "@assets/icon/ranking/rank2.png";
import rank3Icon from "@assets/icon/ranking/rank3.png";
import kuroomEmptyIcon from "@assets/icon/kuroom-icon/kuroom-gray.svg";
import { useUserSharingRankingQuery } from "@/queries";

import styles from "./HomeRanking.module.css";
import Loading from "@/shared/components/Loading/Loading";

const HomeRanking = () => {
  const navigate = useNavigate();

  const { userRankingData, isPendingUserRankingData } =
    useUserSharingRankingQuery();

  const goToMyLocationRankingPage = () => {
    navigate("/mylocationranking");
  };

  return (
    <div className={styles.MyLocationRankingBackground}>
      <div className={styles.MyLocationRankingWrapper}>
        <div className={styles.MyLocationRankingSectionTitle}>
          <div className={styles.TitleWrapper}>
            <h1 className={styles.SectionTitleBold}>내 장소 랭킹</h1>
            <span className={styles.NormalText}>
              내가 자주 간 장소를 모아 보여드려요 :)
            </span>
          </div>
          <img
            className={styles.ArrowButton}
            src={arrowRight}
            alt="자세히 보기"
            onClick={goToMyLocationRankingPage}
          />
        </div>
        {isPendingUserRankingData ? (
          <Loading type="section" sectionHeight={154} />
        ) : userRankingData && userRankingData.length > 0 ? (
          <div className={styles.RankingContentWrapper}>
            {userRankingData.map((item, index) => (
              <div
                key={index}
                className={`${styles.EachRankingContentContainer} ${
                  index === 0
                    ? styles.RankBg1
                    : index === 1
                      ? styles.RankBg2
                      : index === 2
                        ? styles.RankBg3
                        : styles.RankBgDefault
                }`}
              >
                <img
                  className={styles.RankIcon}
                  src={
                    index === 0
                      ? rank1Icon
                      : index === 1
                        ? rank2Icon
                        : rank3Icon
                  }
                  alt="메달"
                />
                <div className={styles.RankingTextWrapper}>
                  <span className={styles.RankingLocationText}>
                    {item.name[0]}
                    <br />
                    {item.name.length > 1 && (
                      <span className={styles.MoreLocation}>
                        외 {item.name.length - 1}곳
                      </span>
                    )}
                  </span>
                  <span className={styles.RankingCountText}>
                    {item.sharingCount}회
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.EmptyViewContainer}>
            <img src={kuroomEmptyIcon} className={styles.EmptyIcon} />
            <span className={styles.EmptyText}>
              아직 위치를 공유하지 않았어요.
              <br /> 1시간 이상 위치 공유를 유지해야 1회로 인정됩니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeRanking;
