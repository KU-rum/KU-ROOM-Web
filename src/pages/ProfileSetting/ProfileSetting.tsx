import React, { useState, ChangeEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProfileSetting.css";

import Select from "../../components/profilesetting/Select/Select";
import Button from "../../components/Button/Button";
import BottomSheet from "../../components/profilesetting/BottomSheet/BottomSheet";
import SelectItem from "../../components/profilesetting/SelectItem/SelectItem";
import InputBar from "../../components/InputBar/InputBar";
import { isValidStudentId } from "../../utils/validations";
import { signupApi } from "../../apis/signup";
import { getAllColleges, getDepartments } from "../../apis/department";

const ProfileSetting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signupEmail, signupId, signupPw, isMarketingOk } =
    location.state || {};

  const [nickname, setNickname] = useState("");
  const [isDuplicatedNickname, setIsDuplicatedNickname] = useState(false);
  const [colleges, setColleges] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isDuplicatedStudentId, setIsDuplicatedStudentId] = useState(false);

  // 임시 선택값 (바텀시트에서 클릭한 값)
  const [tempSelectedCollege, setTempSelectedCollege] = useState("");
  const [tempSelectedDepartment, setTempSelectedDepartment] = useState("");

  const [isCollegeSheetOpen, setIsCollegeSheetOpen] = useState(false);
  const [isDepartmentSheetOpen, setIsDepartmentSheetOpen] = useState(false);

  useEffect(() => {
    fetchToGetColleges();
  }, []);

  useEffect(() => {
    fetchToGetDepartments(selectedCollege);
  }, [selectedCollege]);

  const fetchToGetColleges = async () => {
    try {
      const response = await getAllColleges();
      setColleges(response);
    } catch (error) {
      console.error("단과대학 목록 불러오기 실패", error);
    }
  };

  const fetchToGetDepartments = async (college: string) => {
    try {
      const response = await getDepartments(college);
      setDepartments(response);
    } catch (error) {
      console.error("학과 목록 불러오기 실패", error);
    }
  };

  // 닉네임이 유효한지 확인하는 변수
  const isNicknameValid =
    nickname.length > 1 &&
    nickname.length <= 10 &&
    /[a-zA-Z가-힣ㄱ-ㅎ]/.test(nickname); // 영어 또는 한글이 반드시 포함되어야 함

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    const userData = {
      email: signupEmail,
      loginId: signupId,
      password: signupPw,
      studentId: studentId,
      department: selectedDepartment,
      nickname: nickname,
      agreementStatus: isMarketingOk ? "AGREED" : "DISAGREED",
    };
    console.log(userData);
    try {
      const response = await signupApi(
        userData,
        setIsDuplicatedNickname,
        setIsDuplicatedStudentId
      );
      console.log("회원가입 성공", response);
      navigate("/welcome");
    } catch (error: any) {
      // console.log("오류 발생", error.message);
    }
  };

  // 프로필 설정이 완료되었는지 확인
  const isProfileComplete =
    isNicknameValid &&
    selectedCollege &&
    selectedDepartment &&
    studentId.length >= 9 &&
    isValidStudentId(studentId);

  useEffect(() => {
    setIsDuplicatedNickname(false);
  }, [nickname]);
  useEffect(() => {
    setIsDuplicatedStudentId(false);
  }, [studentId]);

  return (
    <div className="profile-setting">
      <div className="profile-setting-header">
        <div className="profile-setting-cloud"></div>
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
        {isDuplicatedStudentId && (
          <span className="ErrorMsg">이미 있는 계정입니다.</span>
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
        <div className="profile-setting-select-list">
          {colleges.map((item) => (
            <SelectItem
              key={item}
              text={item}
              isSelected={tempSelectedCollege === item}
              onClick={() => handleClickedCollege(item)}
            />
          ))}
        </div>
      </BottomSheet>

      {/* 학과 선택 바텀시트 */}
      <BottomSheet
        isOpen={isDepartmentSheetOpen}
        onClose={() => setIsDepartmentSheetOpen(false)}
        onApply={handleApplyDepartment}
        title="학과"
        selectedItem={tempSelectedDepartment}
      >
        <div className="profile-setting-select-list">
          {selectedCollege &&
            departments.map((item) => (
              <SelectItem
                key={item}
                text={item}
                isSelected={tempSelectedDepartment === item}
                onClick={() => handleClickedDepartment(item)}
              />
            ))}
        </div>
      </BottomSheet>
    </div>
  );
};

export default ProfileSetting;
