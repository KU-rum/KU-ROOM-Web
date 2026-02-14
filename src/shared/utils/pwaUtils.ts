// PWA 설치 상태 감지 유틸리티

const STORAGE_KEY = "pwa-guide-dismissed";

export const isRunningAsPwa = (): boolean => {
  const isStandalone = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
  const isIosStandalone = (navigator as unknown as { standalone?: boolean })
    .standalone === true;
  return isStandalone || isIosStandalone;
};

export const isPwaGuideDismissed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const dismissPwaGuide = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Safari 프라이빗 브라우징 등 localStorage 접근 불가 환경 대응
  }
};

export const shouldShowPwaGuide = (): boolean => {
  if (isRunningAsPwa()) return false;
  if (isPwaGuideDismissed()) return false;
  return true;
};
