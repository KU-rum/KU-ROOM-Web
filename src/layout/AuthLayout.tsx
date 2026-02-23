import { Navigate, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
