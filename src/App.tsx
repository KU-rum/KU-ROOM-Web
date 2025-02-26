import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Notice from "./pages/Notice";
import Signup from "./pages/Signup";
import Login from "./pages/Login/Login";

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
          path: "/notice",
          element: <Notice />,
        },
        {
          path: "/community",
          element: <Community />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
