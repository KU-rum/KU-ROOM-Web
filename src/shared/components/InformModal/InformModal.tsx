import React from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

import { logoutApi } from "@apis/auth";
import { clearAuthStorage } from "@utils/storageUtils";
import cloudIcon from "@assets/icon/cloud.svg";

import Button from "../Button/Button";
import styles from "./InformModal.module.css";

type Props = {
  modalType: string;
  modalState: boolean;
  changedNickname?: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType?: React.Dispatch<React.SetStateAction<string>>;
  setFindStep?: React.Dispatch<React.SetStateAction<number>>;
};

const InformModal = ({
  modalType,
  modalState,
  changedNickname,
  setModalState,
  setModalType,
  setFindStep,
}: Props) => {
  const navigate = useNavigate();

  // 각 모달 유형에 따른 텍스트 및 핸들러 매핑
  const modalConfigs: {
    [key: string]: {
      title: React.ReactNode;
      description?: string;
      handleModalButton: () => void;
    };
  } = {
    informEmail: {
      title: "안내 이메일을 발송하였습니다.",
      description: "메일이 안 왔다면, 스팸함을 확인해주세요.",
      handleModalButton: () => {
        setFindStep?.(1);
        setModalState(false);
      },
    },
    EmailFailed: {
      title: "이메일 전송에 실패했습니다.",
      description: "입력하신 이메일이 맞는지 확인해주세요.",
      handleModalButton: () => {
        setModalType?.("informEmail");
        setModalState(false);
      },
    },
    NewPassword: {
      title: "비밀번호가 재설정되었습니다.",
      description: "다시 로그인해주세요.",
      handleModalButton: async () => {
        setModalState(false);
        if (localStorage.getItem("accessToken")) {
          const logoutResponse = await logoutApi();
          console.log(logoutResponse);
          clearAuthStorage();
        }
        navigate("/login");
      },
    },
    NicknameChange: {
      title: (
        <>
          <span style={{ color: "#009733", fontWeight: "700" }}>
            {changedNickname}
          </span>{" "}
          님
          <br />
          닉네임을 변경하였습니다.
        </>
      ),
      handleModalButton: () => {
        setModalState(false);
        navigate(-1);
      },
    },
    NonExistentEmail: {
      title: "존재하지 않는 사용자입니다.",
      description: "이메일을 다시 입력해주세요.",
      handleModalButton: () => {
        setModalState(false);
      },
    },
  };

  const currentModal = modalConfigs[modalType];

  if (!currentModal) return null;

  return (
    <ReactModal
      isOpen={modalState}
      className={styles.InformModalContainer}
      overlayClassName={styles.Overlay}
      ariaHideApp={false}
    >
      <img src={cloudIcon} alt="쿠룸아이콘" style={{ width: "30px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className={styles.InformText}>{currentModal.title}</span>
        {currentModal.description && (
          <span className={styles.Graytext}>{currentModal.description}</span>
        )}
      </div>
      <Button onClick={currentModal.handleModalButton}>확인</Button>
    </ReactModal>
  );
};

export default InformModal;
