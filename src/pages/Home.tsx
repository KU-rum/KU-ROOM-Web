// 홈 페이지

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // 위치 불러오기 연습용
  interface Location {
    latitude: number;
    longitude: number;
  }

  const [location, setLocation] = useState<Location | null>(null);
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    if (location !== null) {
      alert(`위치 : ${location?.latitude},${location?.longitude}`);
    }
  }, [location]);

  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
    getLocation();
  }, []);
  return (
    <div>
      위치 : {location?.latitude} / {location?.longitude}
    </div>
  );
};

export default Home;
