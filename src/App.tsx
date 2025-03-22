import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Notice from "./pages/Notice/Notice";
import Login from "./pages/Login/Login";
import FindIdPw from "./pages/FindIdPw/FindIdPw";
import SignupInfo from "./pages/Signup/SignupInfo";
import IdentityVerify from "./pages/Signup/IdentityVerify";
import ProfileSetting from "./pages/ProfileSetting/ProfileSetting";
import Welcome from "./pages/Welcome/Welcome";
import Agreement from "./pages/Signup/Agreement";
import Map from "./pages/Map";
import MyPage from "./pages/MyPage/MyPage";
import ProfileChange from "./pages/MyPage/ProfileChange/ProfileChange";
import ChangePw from "./pages/MyPage/ChangePw/ChangePw";
import ChangeNickname from "./pages/MyPage/ChangeNickname/ChangeNickname";
import Alarm from "./pages/MyPage/Alarm/Alarm";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "notice",
          element: <Notice />,
        },
        {
          path: "community",
          element: <Community />,
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
          path: "profilesetting",
          element: <ProfileSetting />,
        },
        {
          path: "welcome",
          element: <Welcome />,
        },
        {
          path: "map",
          element: <Map />,
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
          element: <Alarm />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
