import { reissueTokenApi } from "@apis/axiosInstance";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const REISSUE_MIN_INTERVAL_MS = 20 * 60 * 1000;
const LAST_REISSUE_AT_KEY = "auth-last-reissue-at";

export const AuthLayout = () => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );
  const inFlightReissueRef = useRef<Promise<boolean> | null>(null);

  const tryReissue = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;
    const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

    // access token이 남아있고 최근 재발급이 15분 이내라면 재발급 호출을 생략한다.
    if (hasAccessToken) {
      const lastReissueAt = Number(
        localStorage.getItem(LAST_REISSUE_AT_KEY) ?? 0,
      );
      if (
        Number.isFinite(lastReissueAt) &&
        Date.now() - lastReissueAt < REISSUE_MIN_INTERVAL_MS
      ) {
        return true;
      }
    }

    if (inFlightReissueRef.current) {
      return inFlightReissueRef.current;
    }

    const reissueTask = (async () => {
      try {
        await reissueTokenApi();
        setIsAuthenticated(true);
        return true;
      } catch {
        return Boolean(localStorage.getItem("accessToken"));
      }
    })();
    inFlightReissueRef.current = reissueTask;

    try {
      return await reissueTask;
    } finally {
      inFlightReissueRef.current = null;
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
