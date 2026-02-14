import { Outlet } from "react-router-dom";
import { usePageTracking } from "@/shared/hooks/usePageTracking";

export const RootLayout = () => {
  usePageTracking();

  return <Outlet />;
};
