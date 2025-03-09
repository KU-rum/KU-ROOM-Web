import { ChangeEvent, useEffect, useState, useReducer } from "react";
import styles from "./FindIdPw.module.css";
import InformModal from "../../components/InformModal/InformModal";
import TopIcon from "../../components/TopIcon";
import { isValidPassword } from "../../utils/validations";
import { dummyLoginInfo, dummyCode } from "../../constants/dummyData";
import FindStep0 from "./FindStep0";
import FindStep1 from "./FindStep1";
import FindStep2 from "./FindStep2";

// 상태 정의
type State = {
  informEmail: string; // 안내 메일을 보낼 이메일 주소
  verifyCode: string; // 인증코드
  isVerifyAttempted: boolean; // 인증을 시도했는지 여부
  inputId: string; // 입력한 아이디
  verifiedId: boolean; // 입력한 아이디가 알맞은지 여부
  newPw: string; // 새 비밀번호 입력
  allowedPw: boolean; // 입력한 새 비밀번호가 조건에 맞는지 여부
  checkPw: string; // 비밀번호 확인 위해 한 번 더 입력
  isCheckedPw: boolean; // 두 비밀번호가 일치하는지 여부
  isAttemptReset: boolean; // 비밀번호 재설정 시도했는지 여부
};

// 액션 정의
type Action =
  | { type: "SET_INFORM_EMAIL"; payload: string }
  | { type: "SET_VERIFY_CODE"; payload: string }
  | { type: "SET_VERIFY_ATTEMPTED"; payload: boolean }
  | { type: "SET_INPUT_ID"; payload: string }
  | { type: "SET_VERIFIED_ID"; payload: boolean }
  | { type: "SET_NEW_PW"; payload: string }
  | { type: "SET_ALLOWED_PW"; payload: boolean }
  | { type: "SET_CHECK_PW"; payload: string }
  | { type: "SET_CHECKED_PW"; payload: boolean }
  | { type: "SET_ATTEMPT_RESET"; payload: boolean }
  | { type: "RESET_ALL" };

// 초기 상태
const initialState: State = {
  informEmail: "",
  verifyCode: "",
  isVerifyAttempted: false,
  inputId: "",
  verifiedId: false,
  newPw: "",
  allowedPw: false,
  checkPw: "",
  isCheckedPw: false,
  isAttemptReset: false,
};
// Reducer 함수
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_INFORM_EMAIL":
      return { ...state, informEmail: action.payload };
    case "SET_VERIFY_CODE":
      return { ...state, verifyCode: action.payload };
    case "SET_VERIFY_ATTEMPTED":
      return { ...state, isVerifyAttempted: action.payload };
    case "SET_INPUT_ID":
      return { ...state, inputId: action.payload };
    case "SET_VERIFIED_ID":
      return { ...state, verifiedId: action.payload };
    case "SET_NEW_PW":
      return { ...state, newPw: action.payload };
    case "SET_ALLOWED_PW":
      return { ...state, allowedPw: action.payload };
    case "SET_CHECK_PW":
      return { ...state, checkPw: action.payload };
    case "SET_CHECKED_PW":
      return { ...state, isCheckedPw: action.payload };
    case "SET_ATTEMPT_RESET":
      return { ...state, isAttemptReset: action.payload };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
};

const FindIdPw = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // 다른 컴포넌트 prop으로 가는 것은 useState로 관리
  const [findStep, setFindStep] = useState(0); // 아이디/비밀번호 찾기 프로세스 스텝
  const [modalState, setModalState] = useState(false); // 모달창 on/off 상태
  const [modalType, setModalType] = useState(""); // 모달창 종류

  // 상태 변경 함수들
  const handleInformEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_INFORM_EMAIL", payload: e.target.value });
  };
  const handleVerifyCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, ""); // 숫자만 입력 가능하도록 제한
    if (newValue.length <= 6) {
      dispatch({ type: "SET_VERIFY_CODE", payload: newValue });
    }
  };
  const handleInputIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_INPUT_ID", payload: e.target.value });
  };
  const handleNewPwChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_NEW_PW", payload: e.target.value });
  };
  const handleCheckPwChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_CHECK_PW", payload: e.target.value });
  };

  // 추후 서버에 인증할 메일 주소 보냄야 함. api 연동 필요
  const sendInformEmail = () => {
    setModalType("informEmail");
    setModalState(true);
  };
  // 인증코드 유효한지 확인. 테스트용 인증코드 로직. api 연동 필요. 이부분은 서버와 얘기 필요할듯? boolean으로 넘겨줄 수도 있음.
  const handleVerifyCodeTest = () => {
    const isValidCode = state.verifyCode === dummyCode;
    if (isValidCode) {
      console.log("비밀번호 재설정으로 넘어가기");
      setFindStep(2);
    } else {
      dispatch({ type: "SET_VERIFY_ATTEMPTED", payload: true });
    }
  };
  // 인증코드 실패 시 2초 간 보여줌
  useEffect(() => {
    if (!state.isVerifyAttempted) return;
    const timer = setTimeout(() => {
      dispatch({ type: "SET_VERIFY_ATTEMPTED", payload: false });
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [state.isVerifyAttempted]);

  const handleResetPassword = () => {
    dispatch({ type: "SET_ATTEMPT_RESET", payload: true });
    // 조건에 맞는지 확인
    dispatch({
      type: "SET_VERIFIED_ID",
      payload: state.inputId === dummyLoginInfo[0].userId,
    });
    dispatch({ type: "SET_ALLOWED_PW", payload: isValidPassword(state.newPw) });
    dispatch({
      type: "SET_CHECKED_PW",
      payload: state.checkPw === state.newPw,
    });
    // 모든 조건이 충족되었을 때 재설정 성공
    if (
      state.inputId === dummyLoginInfo[0].userId &&
      isValidPassword(state.newPw) &&
      state.checkPw === state.newPw
    ) {
      console.log("재설정 성공!");
      setModalType("NewPassword");
      setModalState(true);
    } else {
      console.log("재설정 실패: 조건을 다시 확인하세요.");
    }
  };

  // 이메일 재전송 버튼 클릭 시 첫화면으로 이동 후 이전 모든 입력 초기화
  const resetAll = () => {
    setFindStep(0);
    dispatch({ type: "RESET_ALL" });
  };

  const renderFindIdPw = () => {
    switch (findStep) {
      // 아이디/비밀번호 찾기 초기. 이메일 입력.
      case 0:
        return (
          <FindStep0
            informEmail={state.informEmail}
            handleInformEmailChange={handleInformEmailChange}
            sendInformEmail={sendInformEmail}
          />
        );
      // 인증코드 입력.
      case 1:
        return (
          <FindStep1
            verifyCode={state.verifyCode}
            isVerifyAttempted={state.isVerifyAttempted}
            handleVerifyCodeChange={handleVerifyCodeChange}
            handleVerifyCodeTest={handleVerifyCodeTest}
            resetAll={resetAll}
          />
        );
      case 2:
        return (
          <FindStep2
            inputId={state.inputId}
            verifiedId={state.verifiedId}
            newPw={state.newPw}
            allowedPw={state.allowedPw}
            checkPw={state.checkPw}
            isCheckedPw={state.isCheckedPw}
            isAttemptReset={state.isAttemptReset}
            handleInputIdChange={handleInputIdChange}
            handleNewPwChange={handleNewPwChange}
            handleCheckPwChange={handleCheckPwChange}
            handleResetPassword={handleResetPassword}
          />
        );
    }
  };
  return (
    <div className={styles.PageWrapper}>
      <div className={styles.MainArea}>
        <TopIcon />
        {renderFindIdPw()}
      </div>
      <InformModal
        modalType={modalType}
        modalState={modalState}
        setModalState={setModalState}
        setFindStep={setFindStep}
      />
    </div>
  );
};

export default FindIdPw;
