import React from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

import { withdrawApi } from "@apis/auth";
import { clearAuthStorage } from "@utils/storageUtils";
import cautionIcon from "@assets/icon/editFriend/cautionIcon.svg";
import Button from "@components/Button/Button";
import { useLogoutMutation } from "@/queries";

import styles from "./ProfileModal.module.css";

interface ProfileModalProps {
  modalState: boolean;
  modalType: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  modalState,
  modalType,
  setModalState,
}) => {
  const navigate = useNavigate();
  const handleCloseModal = () => setModalState(false);
  const { logout } = useLogoutMutation();

  // 서버에 각각 요청
  const handleClick = async () => {
    switch (modalType) {
      case "logout":
        setModalState(false);
        logout();
        break;
      case "withdraw":
        setModalState(false);
        await withdrawApi();
        clearAuthStorage();
        navigate("/login");
        break;
    }
  };
  const renderModalContent = () => {
    switch (modalType) {
      case "logout":
        return (
          <span className={styles.InformText}>로그아웃 하시겠습니까?</span>
        );
      case "withdraw":
        return (
          <>
            <span className={styles.InformText}>탈퇴하시겠습니까?</span>
            <span className={styles.AdditionalInform}>
              모든 정보는 삭제되며, 되돌릴 수 없습니다.
            </span>
          </>
        );
    }
  };
  return (
    <ReactModal
      isOpen={modalState}
      className={styles.ProfileModalContainer}
      overlayClassName={styles.Overlay}
      ariaHideApp={false}
    >
      <img className={styles.CautionIcon} src={cautionIcon} alt="느낌표" />
      <div className={styles.TextWrapper}>{renderModalContent()}</div>
      <div className={styles.ButtonWrapper}>
        <Button variant="tertiary" onClick={handleCloseModal} size="sm">
          취소
        </Button>
        <Button onClick={handleClick} size="sm">
          확인
        </Button>
      </div>
    </ReactModal>
  );
};

export default ProfileModal;
