import { useEffect } from "react";
import { toast, ToastOptions } from "react-toastify";
import CustomToast from "../components/custom-toast/CustomToast";

const TOAST_CONTAINER_SELECTOR = ".Toastify__toast-container";
const TOAST_SELECTOR = ".Toastify__toast";

const useToast = () => {
  const toastOptions: ToastOptions = {
    position: "bottom-center",
    icon: false,
    closeButton: false,
    autoClose: 2000,
    hideProgressBar: true,
    style: {
      background: "transparent",
      boxShadow: "none",
      padding: 0,
      display: "flex",
      justifyContent: "center",
      marginBottom: "90px",
    },
  };

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 토스트(또는 컨테이너) 내부를 클릭한 경우는 무시 (토스트 바깥 클릭만 닫기)
      if (
        target.closest(TOAST_SELECTOR) ||
        target.closest(TOAST_CONTAINER_SELECTOR)
      ) {
        return;
      }

      // 바깥 영역 클릭 시 모든 토스트 즉시 닫기
      toast.dismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return {
    info: (message: string) =>
      toast.info(<CustomToast message={message} />, toastOptions),
    error: (message: string) =>
      toast.error(
        <CustomToast message={message} isError={true} />,
        toastOptions
      ),
  };
};

export default useToast;
