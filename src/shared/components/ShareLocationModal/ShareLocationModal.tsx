import React from "react";
import ReactModal from "react-modal";

import { shareUserLocationApi, unshareLocationApi } from "@apis/map";
import cautionIcon from "@assets/icon/editFriend/cautionIcon.svg";
import Button from "@components/Button/Button";

import styles from "./ShareLocationModal.module.css";

interface ShareLocationModalProps {
  modalState: boolean;
  isSharedLocation?: boolean;
  ableToShare?: boolean;
  nearLocation?: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareLocationModal: React.FC<ShareLocationModalProps> = ({
  modalState,
  isSharedLocation,
  ableToShare,
  nearLocation,
  setModalState,
}) => {
  const handleCloseModal = () => setModalState(false);

  // 서버에 각각 요청
  const handleSharingLocation = async () => {
    if (!nearLocation) return;
    try {
      const response = await shareUserLocationApi(nearLocation);
      console.log(response);

      setModalState(false);
    } catch (error) {
      console.error("위치 공유 실패 : ", error);
    }
  };
  const handleUnSharingLocation = async () => {
    try {
      const response = await unshareLocationApi();
      console.log("서버에 공유 해제 요청");
      console.log(response);

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
        ) : !ableToShare ? (
          <>
            <span className={styles.BoldText}>위치 공유가 불가합니다.</span>
            <span className={styles.AdditionalInform}>
              학교 건물 안에서 위치 공유를 시도해주세요.
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
        {!isSharedLocation && !ableToShare ? (
          <Button onClick={handleCloseModal} size="sm">
            확인
          </Button>
        ) : (
          <>
            <Button variant="tertiary" onClick={handleCloseModal} size="sm">
              취소
            </Button>
            <Button
              onClick={
                isSharedLocation
                  ? handleUnSharingLocation
                  : handleSharingLocation
              }
              size="sm"
            >
              확인
            </Button>
          </>
        )}
      </div>
    </ReactModal>
  );
};

export default ShareLocationModal;
