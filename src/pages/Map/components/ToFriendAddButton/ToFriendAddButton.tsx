import { useNavigate } from "react-router-dom";

import styles from "./ToFriendAddButton.module.css";

const ToFriendAddButton = () => {
  const navigate = useNavigate();
  const handleClick = () => [navigate("/friendadd")];
  return (
    <button className={styles.Button} type="button" onClick={handleClick}>
      친구 추가
    </button>
  );
};

export default ToFriendAddButton;
