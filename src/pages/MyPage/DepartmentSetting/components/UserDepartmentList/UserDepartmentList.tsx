import React from "react";

import deleteIcon from "@assets/icon/deleteIcon.svg";
import { DepartmentType } from "@apis/department";

import styles from "./UserDepartmentList.module.css";

interface UserDepartmentListProps {
  userDepartment?: DepartmentType[];
  handleDeleteDepartment: (value: string) => void;
}

const UserDepartmentList: React.FC<UserDepartmentListProps> = ({
  userDepartment,
  handleDeleteDepartment,
}) => {
  return (
    <>
      {userDepartment &&
        userDepartment.map((item, index) => (
          <div key={index} className={styles.UserDepartmentContainer}>
            <div className={styles.DepartmentInfoWrapper}>
              <span className={styles.DepartmentTitle}>{item.department}</span>
              <span className={styles.CollegeTitle}>{item.college}</span>
            </div>
            <img
              src={deleteIcon}
              alt="삭제"
              onClick={() => handleDeleteDepartment(item.department)}
            />
          </div>
        ))}
    </>
  );
};

export default UserDepartmentList;
