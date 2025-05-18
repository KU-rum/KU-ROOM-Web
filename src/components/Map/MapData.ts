import friendChip from "../../assets/map/chips/friendChip.svg";
import collegeChip from "../../assets/map/chips/collegeChip.svg";
import kcubehubChip from "../../assets/map/chips/kcubehubChip.svg";
import storeChip from "../../assets/map/chips/storeChip.svg";
import cafeChip from "../../assets/map/chips/cafeChip.svg";
import restaurantChip from "../../assets/map/chips/restaurantChip.svg";
import officeChip from "../../assets/map/chips/officeChip.svg";
import dormitoryChip from "../../assets/map/chips/dormitoryChip.svg";
import bankChip from "../../assets/map/chips/bankChip.svg";
import postChip from "../../assets/map/chips/postChip.svg";
// 카테고리 칩
const CategoryChips = [
  {
    title: "친구",
    icon: friendChip,
    category: 0,
  },
  {
    title: "단과대",
    icon: collegeChip,
    category: 1,
  },
  {
    title: "K-Cube",
    icon: kcubehubChip,
    category: 2,
  },
  {
    title: "K-Hub",
    icon: kcubehubChip,
    category: 3,
  },
  {
    title: "편의점",
    icon: storeChip,
    category: 4,
  },
  {
    title: "레스티오",
    icon: cafeChip,
    category: 5,
  },
  {
    title: "1847",
    icon: cafeChip,
    category: 6,
  },
  {
    title: "학생식당",
    icon: restaurantChip,
    category: 7,
  },
  {
    title: "학과사무실",
    icon: officeChip,
    category: 8,
  },
  {
    title: "기숙사",
    icon: dormitoryChip,
    category: 9,
  },
  {
    title: "은행",
    icon: bankChip,
    category: 10,
  },
  {
    title: "우체국",
    icon: postChip,
    category: 11,
  },
];

import collegeMarker from "../../assets/map/markers/collegeMarker.svg";
import cafeMarker from "../../assets/map/markers/cafeMarker.svg";
// 마커
const KuroomMarkers = [
  {
    category: "레스티오",
    markers: [
      {
        lat: 37.5396,
        lng: 127.0731,
        title: "레스티오 건대점",
        icon: cafeMarker,
      },
      {
        lat: 37.5402,
        lng: 127.0735,
        title: "레스티오 동물생명대점",
        icon: cafeMarker,
      },
      {
        lat: 37.542,
        lng: 127.0738,
        title: "레스티오 도서관점",
        icon: cafeMarker,
      },
      {
        lat: 37.5428,
        lng: 127.0728,
        title: "레스티오 예술문화관점",
        icon: cafeMarker,
      },
      {
        lat: 37.5444,
        lng: 127.0764,
        title: "레스티오 경영대점",
        icon: cafeMarker,
      },
      {
        lat: 37.5418,
        lng: 127.0788,
        title: "레스티오 공학관점",
        icon: cafeMarker,
      },
    ],
  },
  {
    category: "1847",
    markers: [
      {
        lat: 37.5417,
        lng: 127.0781,
        title: "1847 건국대학생회관점",
        icon: cafeMarker,
      },
      {
        lat: 37.5418,
        lng: 127.0737,
        title: "1847 상허기념도서관점",
        icon: cafeMarker,
      },
    ],
  },
  {
    category: "신공학관",
    markers: [
      {
        lat: 37.5405,
        lng: 127.0793,
        title: "신공학관",
        icon: collegeMarker,
      },
    ],
  },
];

// 장소 정보
const dummyLocationInfo = [
  {
    category: "레스티오",
    infos: [
      {
        title: "레스티오 건대점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
      {
        title: "레스티오 동물생명대점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
      {
        title: "레스티오 도서관점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
      {
        title: "레스티오 예술문화관점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
      {
        title: "레스티오 경영대점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
      {
        title: "레스티오 공학관점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
    ],
  },
  {
    category: "1847",
    infos: [
      {
        title: "1847 건국대학생회관점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
      {
        title: "1847 상허기념도서관점",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
    ],
  },
  {
    category: "신공학관",
    infos: [
      {
        title: "신공학관",
        subtit: "~~~입니다.",
        friends: [],
        info: "예시 정보들입니다!!!!",
      },
    ],
  },
];

import defaultProfileImg from "../../assets/defaultProfileImg.svg";
import imgEx1 from "../../assets/ExampleImg/locationDetail/detailEx1.png";
import imgEx2 from "../../assets/ExampleImg/locationDetail/detailEx2.png";
import imgEx3 from "../../assets/ExampleImg/locationDetail/detailEx3.png";
import imgEx4 from "../../assets/ExampleImg/locationDetail/detailEx4.png";

// 장소 상세 정보
const dummyDetailInfo = {
  imgs: [imgEx1, imgEx2, imgEx3, imgEx4],
  title: "레스티오 공학관점",
  subtit: "레스티오의 공학관점입니다!",
  friends: [
    { nickname: "쿠룸", profileImg: defaultProfileImg },
    { nickname: "쿠룸2", profileImg: defaultProfileImg },
    { nickname: "쿠룸3", profileImg: defaultProfileImg },
  ],
  info: "어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??! 어쩌구저쩌구~~~ 중요한 정보!!??!",
};

export { CategoryChips, KuroomMarkers, dummyLocationInfo, dummyDetailInfo };

// test
// test용 주석
