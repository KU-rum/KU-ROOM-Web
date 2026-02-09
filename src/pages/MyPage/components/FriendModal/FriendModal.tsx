import React, { useState } from "react";
import ReactModal from "react-modal";

import {
  acceptRequest,
  friendBlock,
  friendDelete,
  friendReport,
  rejectRequest,
} from "@apis/friend";
import cautionIcon from "@assets/icon/editFriend/cautionIcon.svg";
import Button from "@components/Button/Button";

import styles from "./FriendModal.module.css";

interface FriendModalProps {
  editFriend: string;
  editFriendId: number;
  modalState: boolean;
  modalType: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshList?: React.Dispatch<React.SetStateAction<boolean>>;
}

const FriendModal: React.FC<FriendModalProps> = ({
  editFriend,
  editFriendId,
  modalState,
  modalType,
  setModalState,
  setRefreshList,
}) => {
  const [reportReason, setReportReason] = useState("");

  const handleInputReportReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportReason(e.target.value);
  };

  const handleCloseModal = () => {
    setModalState(false);
    setReportReason("");
  };

  const handleEditFriend = async () => {
    try {
      switch (modalType) {
        case "accept":
          await acceptRequest(editFriendId);
          break;
        case "refuse":
          await rejectRequest(editFriendId);
          break;
        case "delete":
          await friendDelete(editFriendId.toString());
          break;
        case "block":
          await friendBlock(editFriendId);
          break;
        case "report":
          await friendReport(editFriendId, reportReason);
          break;
      }
    } catch (error) {
      console.error(`친구 ${modalType} 중 오류:`, error);
    } finally {
      setModalState(false);
      if (setRefreshList) setRefreshList((prev) => !prev);
      setReportReason("");
    }
  };

  const renderModalContent = () => {
    const nicknameSpan = <span className={styles.Nickname}>{editFriend}</span>;

    switch (modalType) {
      case "delete":
        return (
          <>
            <span className={styles.InformText}>
              {nicknameSpan} 님을 친구 목록에서
              <br />
              삭제하시겠습니까?
            </span>
            <span className={styles.AdditionalInform}>
              다시 친구로 추가하실 수 있습니다.
            </span>
          </>
        );
      case "block":
        return (
          <span className={styles.InformText}>
            {nicknameSpan} 님을 차단하시겠습니까?
          </span>
        );
      case "report":
        return (
          <div className={styles.ReportWrapper}>
            <span className={styles.InformText}>
              {nicknameSpan} 님을 신고하시겠습니까?
            </span>
            <input
              className={styles.ReportReasonInput}
              type="text"
              value={reportReason}
              onChange={(e) => handleInputReportReason(e)}
              placeholder="신고이유를 작성해주세요."
            />
          </div>
        );
      case "accept":
        return (
          <span className={styles.BoldText}>친구요청을 수락하시겠습니까?</span>
        );
      case "refuse":
        return (
          <span className={styles.BoldText}>친구요청을 거절하시겠습니까?</span>
        );
      default:
        return null;
    }
  };

  return (
    <ReactModal
      isOpen={modalState}
      className={styles.FriendModalContainer}
      overlayClassName={styles.Overlay}
      ariaHideApp={false}
    >
      <img className={styles.CautionIcon} src={cautionIcon} alt="느낌표" />
      <div className={styles.TextWrapper}>{renderModalContent()}</div>
      <div className={styles.ButtonWrapper}>
        <Button variant="tertiary" onClick={handleCloseModal} size="sm">
          취소
        </Button>
        <Button
          onClick={handleEditFriend}
          size="sm"
          disabled={modalType === "report" && reportReason.trim() === ""}
        >
          확인
        </Button>
      </div>
    </ReactModal>
  );
};

export default FriendModal;
