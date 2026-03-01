import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { shouldShowPwaGuide } from "@utils/pwaUtils";
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
import SocialCallback from "@pages/SocialCallback/SocialCallback";

import "@/shared/styles/global.css";
import ChatbotMain from "@pages/Chatbot/ChatbotMain/ChatbotMain";
import ChatPage from "@pages/Chatbot/ChatPage/ChatPage";
import LocationTotalRank from "@pages/Map/LocationTotalRank/LocationTotalRank";
import MapLayout from "@pages/Map/layout/MapLayout";
import ShareLocation from "@pages/ShareLocation/ShareLocation";
import PwaGuide from "@pages/PwaGuide/PwaGuide";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AuthLayout } from "@/layout/AuthLayout";

const RootIndex = () => {
  if (shouldShowPwaGuide()) {
    return <Navigate to="/pwa-guide" replace />;
  }
  return <Navigate to="/home" replace />;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <RootIndex />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <SignupInfo />,
        },
        {
          path: "identityverification",
          element: <IdentityVerify />,
        },
        {
          path: "agreement",
          element: <Agreement />,
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
          path: "findidpw",
          element: <FindIdPw />,
        },
        {
          path: "social/callback",
          element: <SocialCallback />,
        },
        {
          path: "pwa-guide",
          element: <PwaGuide />,
        },
        {
          element: <AuthLayout />,
          children: [
            {
              path: "home",
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
              path: "chatbot-main",
              element: <ChatbotMain />,
            },
            {
              path: "chat",
              element: <ChatPage />,
            },
            {
              path: "map",
              element: <MapLayout />,
              children: [
                {
                  index: true,
                  element: <MapPage />,
                },
                {
                  path: "location-total-rank/:placeName?",
                  element: <LocationTotalRank />,
                },
              ],
            },
            {
              path: "share-location",
              element: <ShareLocation />,
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
      ],
    },
  ]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
