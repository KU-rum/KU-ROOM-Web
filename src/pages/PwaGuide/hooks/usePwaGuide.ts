import { useNavigate } from "react-router-dom";
import { dismissPwaGuide } from "@utils/pwaUtils";

export const usePwaGuide = () => {
  const navigate = useNavigate();

  const handleDismiss = () => {
    dismissPwaGuide();
    navigate("/login");
  };

  return { handleDismiss };
};
