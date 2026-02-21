import React, { useState, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useToast from "@hooks/use-toast";
import {
  useCollegeDepartmentsQuery,
  useCollegesQuery,
  useSignupMutation,
  useSocialUserSignupMutation,
} from "@/queries";
import Button from "@components/Button/Button";
import InputBar from "@components/InputBar/InputBar";
import Header from "@components/Header/Header";
import Loading from "@components/Loading/Loading";
import { isValidStudentId } from "@utils/validations";

import Select from "./components/Select/Select";
import BottomSheet from "./components/BottomSheet/BottomSheet";
import SelectItem from "./components/SelectItem/SelectItem";
import "./ProfileSetting.css";

const ProfileSetting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signupEmail, signupId, signupPw, isMarketingOk } =
    location.state || {};

  const toast = useToast();
  const { signup, isPendingSignup } = useSignupMutation();

  // 소셜 로그인 신규 회원인지 확인
  const preSignupToken = sessionStorage.getItem("preSignupToken");
  const isSocialSignup = !!preSignupToken;

  const [nickname, setNickname] = useState("");
  const [isDuplicatedNickname, setIsDuplicatedNickname] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [studentId, setStudentId] = useState("");

  // 임시 선택값 (바텀시트에서 클릭한 값)
  const [tempSelectedCollege, setTempSelectedCollege] = useState("");
  const [tempSelectedDepartment, setTempSelectedDepartment] = useState("");

  const [isCollegeSheetOpen, setIsCollegeSheetOpen] = useState(false);
  const [isDepartmentSheetOpen, setIsDepartmentSheetOpen] = useState(false);

  const { collegesData, isPendingCollegesData } = useCollegesQuery();
  const { departmentsData, isPendingDepartmentsData } =
    useCollegeDepartmentsQuery(selectedCollege);
  const { socialUserSignup, isPendingSocialUserSignup } =
    useSocialUserSignupMutation();

  // 닉네임이 유효한지 확인하는 변수
  const isNicknameValid =
    nickname.length > 1 &&
    nickname.length <= 10 &&
    /[a-zA-Z가-힣ㄱ-ㅎ]/.test(nickname); // 영어 또는 한글이 반드시 포함되어야 함

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsDuplicatedNickname(false);
    const inputNickname = e.target.value;
    if (inputNickname.length <= 10) {
      setNickname(inputNickname);
    }
  };

  const handleStudentIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setStudentId(value);
  };

  const handleClickedCollege = (selectedCollege: string) => {
    setTempSelectedCollege(selectedCollege);
  };

  const handleClickedDepartment = (selectedDepartment: string) => {
    setTempSelectedDepartment(selectedDepartment);
  };

  const handleApplyCollege = (selectedItem: string) => {
    setSelectedCollege(selectedItem);
    setSelectedDepartment(""); // 대학이 바뀌면 학과 초기화
  };

  const handleApplyDepartment = (selectedItem: string) => {
    setSelectedDepartment(selectedItem);
  };

  const handleSubmit = async () => {
    if (isSocialSignup && preSignupToken) {
      const socialUserData = {
        token: preSignupToken,
        studentId,
        department: selectedDepartment,
        nickname,
        agreementStatus: isMarketingOk ? "AGREED" : "DISAGREED",
      };

      socialUserSignup(socialUserData, {
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "회원가입 중 오류 발생";
          if (errorMessage === "이미 존재하는 닉네임입니다.") {
            setIsDuplicatedNickname(true);
          } else {
            toast.error(
              error.response?.data?.message ||
                "소셜 로그인 회원 생성 중 오류 발생",
            );
          }
        },
      });
    } else {
      const userData = {
        email: signupEmail || "",
        loginId: signupId || "",
        password: signupPw || "",
        studentId: studentId,
        department: selectedDepartment,
        nickname: nickname,
        agreementStatus: isMarketingOk ? "AGREED" : "DISAGREED",
      };

      signup(userData, {
        onError: (error: any) => {
          const errorCode = error.response?.data?.code;
          if (errorCode === 306) {
            setIsDuplicatedNickname(true);
          } else {
            toast.error("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
            navigate("/login");
          }
        },
      });
    }
  };

  // 프로필 설정이 완료되었는지 확인
  const isProfileComplete =
    isNicknameValid &&
    selectedCollege &&
    selectedDepartment &&
    studentId.length >= 9 &&
    isValidStudentId(studentId);

  if (isPendingSignup || isPendingSocialUserSignup) {
    return <Loading />;
  }

  return (
    <>
      <Header onlyIcon={true} />
      <div className="profile-setting">
        <div className="profile-setting-header">
          <h1 className="profile-setting-title">
            <span className="text-primary">쿠룸</span>에 필요한
            <br />
            프로필을 설정해주세요.
          </h1>
        </div>

        <div className="profile-setting-form">
          <InputBar
            label="닉네임"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요 (10자 이하)"
          />
          {!isNicknameValid && nickname && (
            <span className="ErrorMsg">
              한글 또는 영어 포함 2자 이상 10자 이내로 입력해주세요.
            </span>
          )}
          {isDuplicatedNickname && (
            <span className="ErrorMsg">이미 있는 닉네임입니다.</span>
          )}
          {/* 닉네임이 유효할 때만 단과대학 선택 표시 */}
          {isNicknameValid && (
            <Select
              label="단과대학"
              value={selectedCollege}
              placeholder="단과대학을 선택해주세요"
              onClick={() => {
                setTempSelectedCollege(selectedCollege); // 현재 선택값으로 초기화
                setIsCollegeSheetOpen(true);
              }}
            />
          )}

          {/* 단과대학이 선택되었을 때만 학과 선택 표시 */}
          {isNicknameValid && selectedCollege && (
            <Select
              label="학과"
              value={selectedDepartment}
              placeholder="학과를 선택해주세요"
              onClick={() => {
                setTempSelectedDepartment(selectedDepartment); // 현재 선택값으로 초기화
                setIsDepartmentSheetOpen(true);
              }}
            />
          )}

          {/* 학과가 선택되었을 때만 학번 입력 표시 */}
          {isNicknameValid && selectedCollege && selectedDepartment && (
            <InputBar
              label="학번"
              type="text"
              value={studentId}
              onChange={handleStudentIdChange}
              placeholder="학번을 입력해주세요"
              isInvalid={studentId.length >= 9 && !isValidStudentId(studentId)}
              errorMessage="유효하지 않은 학번입니다."
            />
          )}
          <div className="profile-setting-button">
            <Button onClick={handleSubmit} disabled={!isProfileComplete}>
              다음으로
            </Button>
          </div>
        </div>

        {/* 단과대학 선택 바텀시트 */}
        <BottomSheet
          isOpen={isCollegeSheetOpen}
          onClose={() => setIsCollegeSheetOpen(false)}
          onApply={handleApplyCollege}
          title="단과대학"
          selectedItem={tempSelectedCollege}
        >
          {isPendingCollegesData ? (
            <Loading type="section" sectionHeight={250} />
          ) : (
            <div className="profile-setting-select-list">
              {collegesData &&
                collegesData.map((item) => (
                  <SelectItem
                    key={item}
                    text={item}
                    isSelected={tempSelectedCollege === item}
                    onClick={() => handleClickedCollege(item)}
                  />
                ))}
            </div>
          )}
        </BottomSheet>

        {/* 학과 선택 바텀시트 */}
        <BottomSheet
          isOpen={isDepartmentSheetOpen}
          onClose={() => setIsDepartmentSheetOpen(false)}
          onApply={handleApplyDepartment}
          title="학과"
          selectedItem={tempSelectedDepartment}
        >
          {isPendingDepartmentsData ? (
            <Loading type="section" sectionHeight={250} />
          ) : (
            <div className="profile-setting-select-list">
              {selectedCollege &&
                departmentsData &&
                departmentsData.map((item) => (
                  <SelectItem
                    key={item}
                    text={item}
                    isSelected={tempSelectedDepartment === item}
                    onClick={() => handleClickedDepartment(item)}
                  />
                ))}
            </div>
          )}
        </BottomSheet>
      </div>
    </>
  );
};

export default ProfileSetting;
