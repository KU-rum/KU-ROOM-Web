import { useState } from "react";

import useToast from "@hooks/use-toast";
import Header from "@components/Header/Header";
import { useUserDepartmentMutation, useUserProfileQuery } from "@/queries";

import DepartmentSearch from "./components/DepartmentSearchBar/DepartmentSearchBar";
import UserDepartmentList from "./components/UserDepartmentList/UserDepartmentList";
import SearchDepartmentList from "./components/SearchDepartmentList/SearchDepartmentList";
import styles from "./DepartmentSetting.module.css";

const DepartmentSetting = () => {
  const toast = useToast();
  const { userProfileData, isPendingUserProfileData } = useUserProfileQuery();
  const { addDepartment, deleteDepartment } = useUserDepartmentMutation();

  const [searchText, setSearchText] = useState("");

  const handleDeleteDepartment = (department: string) => {
    if (userProfileData?.departments.length === 1) {
      // TODO: 추후 멘트 수정
      toast.error("최소 하나 이상 설정해야 합니다.");
      return;
    }
    deleteDepartment(department);
  };

  // 이미 설정한 학과를 추가하려고 할 경우, addDepartment가 실행되지 않도록
  const handleAddUserDepartment = (department: string) => {
    if (userProfileData?.departments.some((d) => d.department === department)) {
      toast.info("이미 설정하신 학과입니다.");
    } else {
      addDepartment(department);
    }
    setSearchText("");
  };

  return (
    <div>
      <Header>학과 설정</Header>
      <div className={styles.DepartmentSettingPage}>
        <div className={styles.SearchBarContainer}>
          <DepartmentSearch
            searchTarget={searchText}
            setSearchTarget={setSearchText}
          />
        </div>
        {isPendingUserProfileData ? (
          <div>로딩중...</div>
        ) : searchText.trim().length > 0 ? (
          <SearchDepartmentList
            searchText={searchText}
            handleAddUserDepartment={handleAddUserDepartment}
          />
        ) : (
          <UserDepartmentList
            userDepartment={userProfileData?.departments}
            handleDeleteDepartment={handleDeleteDepartment}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentSetting;
