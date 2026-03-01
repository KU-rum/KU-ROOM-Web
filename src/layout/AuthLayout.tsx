import { reissueTokenApi } from "@apis/axiosInstance";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const REISSUE_COOLDOWN_MS = 3000;

export const AuthLayout = () => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );
  const isRefreshingRef = useRef(false);
  const lastRefreshAttemptRef = useRef(0);

  const tryReissue = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const now = Date.now();
    if (isRefreshingRef.current) {
      return Boolean(localStorage.getItem("accessToken"));
    }
    if (now - lastRefreshAttemptRef.current < REISSUE_COOLDOWN_MS) {
      return Boolean(localStorage.getItem("accessToken"));
    }

    isRefreshingRef.current = true;
    lastRefreshAttemptRef.current = now;

    try {
      await reissueTokenApi();
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
      const hasRefreshToken = Boolean(localStorage.getItem("refreshToken"));

      if (!hasRefreshToken) {
        if (mounted) {
          setIsAuthenticated(hasAccessToken);
          setIsBootstrapping(false);
        }
        return;
      }

      const reissued = await tryReissue();
      if (mounted) {
        setIsAuthenticated(reissued || hasAccessToken);
        setIsBootstrapping(false);
      }
    };

    void bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [tryReissue]);

  useEffect(() => {
    const handleAppResume = async () => {
      if (document.visibilityState === "hidden") return;

      const hasRefreshToken = Boolean(localStorage.getItem("refreshToken"));
      if (!hasRefreshToken) {
        setIsAuthenticated(Boolean(localStorage.getItem("accessToken")));
        return;
      }

      const reissued = await tryReissue();
      if (!reissued && !localStorage.getItem("accessToken")) {
        setIsAuthenticated(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void handleAppResume();
      }
    };

    window.addEventListener("focus", handleAppResume);
    window.addEventListener("pageshow", handleAppResume);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleAppResume);
      window.removeEventListener("pageshow", handleAppResume);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tryReissue]);

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
