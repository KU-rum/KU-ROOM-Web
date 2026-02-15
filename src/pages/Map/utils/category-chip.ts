import { CategoryEnum } from "@/shared/types";

export const getCategoryEnum = (title: string): CategoryEnum | undefined => {
  switch (title) {
    case "친구":
      return "FRIEND";
    case "건물":
      return "BUILDING";
    case "단과대":
      return "COLLEGE";
    case "K-Cube":
      return "K_CUBE";
    case "K-Hub":
      return "K_HUB";
    case "편의점":
      return "CONVENIENCE_STORE";
    case "카페":
      return "CAFE";
    case "복사실":
      return "COPY_ROOM";
    case "학생식당":
      return "STUDENT_CAFETERIA";
    case "기숙사":
      return "DORMITORY";
    case "은행":
      return "BANK";
    case "우체국":
      return "POST_OFFICE";
    default:
      return;
  }
};
