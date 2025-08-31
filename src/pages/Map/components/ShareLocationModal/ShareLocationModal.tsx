import React from "react";
import ReactModal from "react-modal";

import { shareUserLocation, unshareLocation } from "@apis/map";
import Button from "@components/Button/Button";
import cautionIcon from "@assets/icon/editFriend/cautionIcon.svg";

import styles from "./ShareLocationModal.module.css";

interface ShareLocationModalProps {
  modalState: boolean;
  isSharedLocation: boolean;
  nearLocation: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  refreshSharedStatus: () => void;
  tryRerendering?: () => void;
}

const ShareLocationModal: React.FC<ShareLocationModalProps> = ({
  modalState,
  isSharedLocation,
  nearLocation,
  setModalState,
  refreshSharedStatus,
  tryRerendering,
}) => {
  const handleCloseModal = () => setModalState(false);

  // 서버에 각각 요청
  const handleSharingLocation = async () => {
    try {
      const response = await shareUserLocation(nearLocation);
      console.log("서버에 내 위치 공유 요청");
      console.log(response);

      refreshSharedStatus();
      if (tryRerendering) tryRerendering();
      setModalState(false);
    } catch (error) {
      console.error("위치 공유 실패 : ", error);
    }
  };
  const handleUnSharingLocation = async () => {
    try {
      const response = await unshareLocation();
      console.log("서버에 공유 해제 요청");
      console.log(response);

      refreshSharedStatus();
      setModalState(false);
    } catch (error) {
      console.error("위치 공유 해제 실패 : ", error);
    }
  };

  return (
    <ReactModal
      isOpen={modalState}
      className={styles.LocationShareModalContainer}
      overlayClassName={styles.Overlay}
      ariaHideApp={false}
    >
      <img className={styles.CautionIcon} src={cautionIcon} alt="느낌표" />
      <div className={styles.TextWrapper}>
        {isSharedLocation ? (
          <>
            <span className={styles.InformText}>
              <span className={styles.BoldText}>위치 공유를 해제</span>
              하시겠습니까?
            </span>
            <span className={styles.AdditionalInform}>
              친구들에게 현재 위치가 보이지 않게 됩니다.
            </span>
          </>
        ) : (
          <>
            <span className={styles.InformText}>
              <span className={styles.BoldText}>{nearLocation}</span>(으)로
              <br />
              <span className={styles.BoldText}>위치를 공유</span>
              하시겠습니까?
            </span>
            <span className={styles.AdditionalInform}>
              친구들에게 현재 위치가 공유됩니다.
            </span>
          </>
        )}
      </div>
      <div className={styles.ButtonWrapper}>
        <Button variant="tertiary" onClick={handleCloseModal} size="sm">
          취소
        </Button>
        <Button
          onClick={
            isSharedLocation ? handleUnSharingLocation : handleSharingLocation
          }
          size="sm"
        >
          확인
        </Button>
      </div>
    </ReactModal>
  );
};

export default ShareLocationModal;
