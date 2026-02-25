import { NOTICE_OTHERS } from "../../constants";
import { useNoticeOthers } from "../../hooks/use-notice-others";

import styles from "./NoticeOthers.module.css";

export default function NoticeOthers() {
  const { noticeOthersData, isPending } = useNoticeOthers();

  const handleNoticeLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const othersList = noticeOthersData
    ? [...NOTICE_OTHERS, ...noticeOthersData]
    : NOTICE_OTHERS;

  return (
    <div className={styles.Wrapper}>
      {isPending ? (
        // TODO: 로딩 컴포넌트 구현 후 교체
        <div className={styles.Label}>불러오는 중...</div>
      ) : (
        othersList.map((item, index) => (
          <button
            key={`${item.name}_${index}`}
            type="button"
            className={styles.OthersItem}
            onClick={() => handleNoticeLink(item.url)}
          >
            <span className={styles.Label}>{item.name}</span>
          </button>
        ))
      )}
    </div>
  );
}
