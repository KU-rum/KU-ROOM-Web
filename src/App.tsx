import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { reissueTokenApi } from "@apis/axiosInstance";
import Home from "@pages/Home/Home";
import Notice from "@pages/Notice/Notice/Notice";
import NoticeDetail from "@pages/Notice/NoticeDetail/NoticeDetail";
import Login from "@pages/Login/Login";
import FindIdPw from "@pages/FindIdPw/FindIdPw";
import SignupInfo from "@pages/Signup/SignupInfo";
import IdentityVerify from "@pages/Signup/IdentityVerify";
import ProfileSetting from "@pages/ProfileSetting/ProfileSetting";
import Welcome from "@pages/Welcome/Welcome";
import Agreement from "@pages/Signup/Agreement";
import MyPage from "@pages/MyPage/MyPageMain/MyPage";
import ProfileChange from "@pages/MyPage/ProfileChange/ProfileChange";
import ChangePw from "@pages/MyPage/ChangePw/ChangePw";
import ChangeNickname from "@pages/MyPage/ChangeNickname/ChangeNickname";
import AlarmSetting from "@pages/MyPage/AlarmSetting/AlarmSetting";
import Alarm from "@pages/Alarm/Alarm";
import MyLocationRanking from "@pages/MyLocationRanking/MyLocationRanking";
import FriendList from "@pages/MyPage/FriendList/FriendList";
import FriendAdd from "@pages/MyPage/FriendAdd/FriendAdd";
import FriendLocationRanking from "@pages/MyLocationRanking/FriendLocationRanking/FriendLocationRanking";
import MapPage from "@pages/Map/MapPage";
import DepartmentSetting from "@pages/MyPage/DepartmentSetting/DepartmentSetting";
import Bookmark from "@pages/Notice/Bookmark/Bookmark";
import Search from "@pages/Notice/Search/Search";
import OAuthCallback from "@pages/OAuthCallback/OAuthCallback";

import "@/shared/styles/global.css";

function App() {
  useEffect(() => {
    const path = window.location.pathname;
    // 아래에 해당하는 페이지들은 다른 앱을 사용하다가 돌아오면 Access Token을 재발급함
    const includedPaths = [
      "alarm",
      "myinfo",
      "profilechange",
      "changepw",
      "changenickname",
      "alarmsetting",
      "friendadd",
      "friendlist",
      "departmentsetting",
      "bookmark",
    ];

    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        includedPaths.includes(path)
      ) {
        await reissueTokenApi();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "alarm",
          element: <Alarm />,
        },
        {
          path: "notice",
          element: <Notice />,
        },
        {
          path: "notice/:id",
          element: <NoticeDetail />,
        },
        {
          path: "notice/:category/:id",
          element: <NoticeDetail />,
        },
        {
          path: "signup",
          element: <SignupInfo />,
        },
        {
          path: "identityverifictaion",
          element: <IdentityVerify />,
        },
        {
          path: "agreement",
          element: <Agreement />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "findidpw",
          element: <FindIdPw />,
        },
        {
          path: "oauth/callback",
          element: <OAuthCallback />,
        },
        {
          path: "profilesetting",
          element: <ProfileSetting />,
        },
        {
          path: "welcome",
          element: <Welcome />,
        },
        {
          path: "map",
          element: <MapPage />,
        },
        {
          path: "myinfo",
          element: <MyPage />,
        },
        {
          path: "profilechange",
          element: <ProfileChange />,
        },
        {
          path: "changepw",
          element: <ChangePw />,
        },
        {
          path: "changenickname",
          element: <ChangeNickname />,
        },
        {
          path: "alarmsetting",
          element: <AlarmSetting />,
        },
        {
          path: "friendadd",
          element: <FriendAdd />,
        },
        {
          path: "friendlist",
          element: <FriendList />,
        },
        {
          path: "departmentsetting",
          element: <DepartmentSetting />,
        },
        {
          path: "mylocationranking",
          children: [
            {
              index: true,
              element: <MyLocationRanking />,
            },
            {
              path: "friendlocationranking",
              element: <FriendLocationRanking />,
            },
          ],
        },
        {
          path: "bookmark",
          element: <Bookmark />,
        },
        {
          path: "search",
          element: <Search />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
