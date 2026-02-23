import React from "react";
import ReactModal from "react-modal";

import cautionIcon from "@assets/icon/editFriend/cautionIcon.svg";
import Button from "@components/Button/Button";
import { useShareUserLocationMutation } from "@/queries";

import styles from "./ShareLocationModal.module.css";

interface ShareLocationModalProps {
  modalState: boolean;
  isSharedLocation?: boolean;
  ableToShare?: boolean;
  placeName?: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareLocationModal: React.FC<ShareLocationModalProps> = ({
  modalState,
  isSharedLocation,
  ableToShare,
  placeName,
  setModalState,
}) => {
  const { shareUserLocation, unshareUserLocation } =
    useShareUserLocationMutation();

  const handleCloseModal = () => setModalState(false);

  const handleSharingLocation = () => {
    if (!placeName) return;
    shareUserLocation(placeName, {
      onSuccess: () => handleCloseModal(),
    });
  };

  const handleUnSharingLocation = () => {
    unshareUserLocation(undefined, { onSuccess: () => handleCloseModal() });
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
              <span className={styles.BoldText}>{placeName}</span>(으)로
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
