import { ChangeEvent, useEffect, useState } from "react";

import { checkDuplictedNickname } from "@apis/signup";
import { useChangeNicknameMutation, useUserProfileQuery } from "@/queries";
import InputBar from "@components/InputBar/InputBar";
import Button from "@components/Button/Button";
import InformModal from "@components/InformModal/InformModal";
import Header from "@components/Header/Header";

import styles from "./ChangeNickname.module.css";

const ChangeNickname = () => {
  const { userProfileData } = useUserProfileQuery();
  const { changeNickname } = useChangeNicknameMutation();

  const [newNickname, setNewNickname] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState("");
  // 닉네임이 유효한지 확인하는 변수
  const isNicknameValid =
    newNickname.length > 1 &&
    newNickname.length <= 10 &&
    (/[a-zA-Z]/.test(newNickname) || /[가-힣ㄱ-ㅎ]/.test(newNickname));
  const handleInputNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputNickname = e.target.value;
    if (inputNickname.length <= 10) {
      setNewNickname(inputNickname);
    }
  };
  const handleChangeNickname = async () => {
    // 서버에 닉네임 중복 여부 검증
    const checkResponse = await checkDuplictedNickname(
      newNickname,
      setErrorMsg,
    );
    if (!checkResponse) return;
    // 서버에 닉네임 변경 요청

    changeNickname(newNickname, {
      onSuccess: () => {
        // 닉네임 변경 모달 생성
        setModalType("NicknameChange");
        setModalState(true);
      },
    });
  };

  useEffect(() => {
    setErrorMsg("");
  }, [newNickname]);

  return (
    <div className={styles.ChangeNicknamePageWrapper}>
      <Header />
      <div className={styles.MainArea}>
        <h1 className={styles.ChangeNicknameTitle}>닉네임 변경하기</h1>
        <InputBar
          label="닉네임"
          type="text"
          value={newNickname}
          placeholder={userProfileData?.nickname}
          onChange={handleInputNicknameChange}
        />
        {!isNicknameValid && newNickname && (
          <span className="ErrorMsg">
            한글 또는 영어 포함 2자 이상 10자 이내로 입력해주세요.
          </span>
        )}
        {errorMsg && <span className="ErrorMsg">{errorMsg}</span>}
        <div className={styles.ButtonWrapper}>
          <Button onClick={handleChangeNickname} disabled={!isNicknameValid}>
            닉네임 변경하기
          </Button>
        </div>
      </div>

      <InformModal
        modalType={modalType}
        modalState={modalState}
        changedNickname={newNickname}
        setModalState={setModalState}
      />
    </div>
  );
};

export default ChangeNickname;
