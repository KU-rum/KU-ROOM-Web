// 지도 페이지
import { useState } from "react";
import BottomBar from "../../components/BottomBar/BottomBar";
import styles from "./MapPage.module.css";
import Map from "../../components/Map/Map";
import myTrackingIcon from "../../assets/map/mylocation.svg";
import MapSearchBar from "../../components/Map/MapSearchBar/MapSearchBar";

const locationCategory = [
  {
    title: "단과대",
    icon: "",
  },
  {
    title: "도서관",
    icon: "",
  },
  {
    title: "제1학생회관",
    icon: "",
  },
  {
    title: "K-Cube",
    icon: "",
  },
  {
    title: "K-Hub",
    icon: "",
  },
  {
    title: "편의점",
    icon: "",
  },
];

const MapPage = () => {
  const [isTracking, setIsTracking] = useState(true); // 내 현재 위치를 따라가는지 상태
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [changeCenter, setChangeCenter] = useState("");

  const handleBlurSearch = () => {
    setSearchLocation("");
    setIsSearchFocused(false);
  };

  return (
    <div>
      <div className={styles.SearchBarContainer}>
        <MapSearchBar
          searchTarget={searchLocation}
          setSearchTarget={setSearchLocation}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={handleBlurSearch}
        />
      </div>

      {isSearchFocused ? (
        <div style={{ marginTop: "100px", marginLeft: "20px" }}>
          검색 화면 구현 예정
          <br />
          <span>{searchLocation}</span>
        </div>
      ) : (
        <>
          <div className={styles.RotationCategoryWrapper}>
            {locationCategory.map((category, index) => (
              <button
                className={styles.LocationCategory}
                key={index}
                onClick={() => {
                  console.log(category.title, " 정보");
                  setChangeCenter(category.title);
                }}
              >
                <div className={styles.LocationCategoryIcon} />
                <span className={styles.LocationCategoryTitle}>
                  {category.title}
                </span>
              </button>
            ))}
          </div>
          <Map
            height="calc(100vh - 92px)"
            isTracking={isTracking}
            setIsTracking={setIsTracking}
            changeCenter={changeCenter}
          />
          <button
            className={styles.TrackingIcon}
            onClick={() => setIsTracking(true)}
          >
            <img
              src={myTrackingIcon}
              alt="위치 추적 아이콘"
              style={{ filter: isTracking ? "none" : "grayscale(100%)" }}
            />
          </button>
          <BottomBar />
        </>
      )}
    </div>
  );
};

export default MapPage;
