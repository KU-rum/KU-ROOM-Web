import { LoginType } from "../stores/userStore";

const MyPageSectionData: { title: string; contents: string[] }[] = [
  {
    title: "친구",
    contents: ["친구 추가", "친구 목록"],
  },
  {
    title: "앱 정보",
    contents: ["약관 및 정책", "개인정보 처리방침", "앱버전", "고객 센터"],
  },
  {
    title: "설정",
    contents: ["알림 설정", "로그아웃", "탈퇴하기"],
  },
];

const getProfileChangeSectionData = (loginType: LoginType) => {
  return [
    {
      // TODO: 소셜로그인일 때 이메일, 아이디, 비밀번호 변경하기 안보이도록 처리해야함
      title: "프로필",
      contents:
        loginType === "social"
          ? ["이메일", "닉네임 변경하기"]
          : ["이메일", "아이디", "비밀번호 변경하기", "닉네임 변경하기"],
    },
    {
      title: "개인정보",
      contents: ["학번", "학과"],
    },
  ];
};

export { MyPageSectionData, getProfileChangeSectionData };
