import React from "react";
import styles from "./MapCategoryChip.module.css";
import { CategoryChips } from "../MapData";

interface CategoryChip {
  title: string;
  icon: string;
  category: number;
}
interface MapCategoryChip {
  setSelectedCategory: (value: CategoryChip) => void;
}

const MapCategoryChip: React.FC<MapCategoryChip> = ({
  setSelectedCategory,
}) => {
  // 버튼 클릭 시 해당하는 위치 배열을 서버에 요청하여 받아야함.
  const clickCategory = (category: CategoryChip) => {
    // title을 이용하여 요청
    setSelectedCategory(category);
  };

  return (
    <div className={styles.CategoryChipsWrapper}>
      {CategoryChips.map((category, index) => (
        <button
          className={styles.CategoryChip}
          key={index}
          onClick={() => clickCategory(category)}
          style={
            category.title === "친구"
              ? { border: "1px solid #009733" }
              : undefined
          }
        >
          <img src={category.icon} alt="칩 아이콘" />
          <span className={styles.CategoryChipTitle}>{category.title}</span>
        </button>
      ))}
    </div>
  );
};

export default MapCategoryChip;
