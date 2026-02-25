import React from "react";
import ReactModal from "react-modal";

import cautionIcon from "@assets/icon/editFriend/cautionIcon.svg";
import Button from "@components/Button/Button";
import { useLogoutMutation, useWithdrawMutation } from "@/queries";

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
  const handleCloseModal = () => setModalState(false);
  const { logout } = useLogoutMutation();
  const { withdraw } = useWithdrawMutation();

  const handleClick = async () => {
    switch (modalType) {
      case "logout":
        setModalState(false);
        logout();
        break;
      case "withdraw":
        setModalState(false);
        withdraw();
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
