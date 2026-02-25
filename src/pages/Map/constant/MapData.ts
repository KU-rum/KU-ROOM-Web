import friendChip from "@assets/map/chips/friendChip.svg";
import buildingChip from "@assets/map/chips/buildingChip.svg";
import kcubehubChip from "@assets/map/chips/kcubehubChip.svg";
import storeChip from "@assets/map/chips/storeChip.svg";
import cafeChip from "@assets/map/chips/cafeChip.svg";
import copyRoomChip from "@assets/map/chips/copyRoomChip.svg";
import restaurantChip from "@assets/map/chips/restaurantChip.svg";
import collegeChip from "@assets/map/chips/collegeChip.svg";
import dormitoryChip from "@assets/map/chips/dormitoryChip.svg";
import bankChip from "@assets/map/chips/bankChip.svg";
import postChip from "@assets/map/chips/postChip.svg";
// 카테고리 칩
const CATEGORY_CHIPS = [
  {
    title: "친구",
    icon: friendChip,
  },
  {
    title: "건물",
    icon: buildingChip,
  },
  {
    title: "단과대",
    icon: collegeChip,
  },
  {
    title: "K-Cube",
    icon: kcubehubChip,
  },
  {
    title: "K-Hub",
    icon: kcubehubChip,
  },
  {
    title: "편의점",
    icon: storeChip,
  },
  {
    title: "카페",
    icon: cafeChip,
  },
  {
    title: "복사실",
    icon: copyRoomChip,
  },
  {
    title: "학생식당",
    icon: restaurantChip,
  },
  {
    title: "기숙사",
    icon: dormitoryChip,
  },
  {
    title: "은행",
    icon: bankChip,
  },
  {
    title: "우체국",
    icon: postChip,
  },
] as const;

export { CATEGORY_CHIPS };
