import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriendListQuery } from "@/queries";
import useToast from "@hooks/use-toast";
import { handleOutsideClick } from "@utils/friendUtils";

export default function useFriendList() {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchNickname, setSearchNickname] = useState("");

  // 친구 수정 관련 상태 모달 상태
  const [editPopupState, setEditPopupState] = useState<{
    isPopupOpen: boolean;
    popupPosition: { top: number; left: number };
    editFriend: string;
    editFriendId: number;
  }>({
    isPopupOpen: false,
    popupPosition: { top: 0, left: 0 },
    editFriend: "",
    editFriendId: 0,
  });

  // 친구 삭제, 차단, 신고하기 팝업 관련 상태
  const popupRef = useRef<HTMLDivElement | null>(null);

  // 친구 관련 수정 모달 상태
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState("");

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    return handleOutsideClick(popupRef, editPopupState.isPopupOpen, () => {
      setEditPopupState((prev) => ({
        ...prev,
        isPopupOpen: false,
      }));
    });
  }, [editPopupState.isPopupOpen]);

  const { friendListData, isPendingFriendList, isErrorFriendList } =
    useFriendListQuery();

  const filteredFriends = useMemo(() => {
    if (!friendListData) return [];

    const nickname = searchNickname.trim();
    if (!nickname) return friendListData;

    return friendListData.filter((friend) =>
      friend.nickname.includes(nickname),
    );
  }, [friendListData, searchNickname]);

  const handleToFriendAdd = () => {
    navigate("/friendadd");
  };

  const handleClosePopup = () => {
    setEditPopupState((prev) => ({
      ...prev,
      isPopupOpen: false,
    }));
  };

  useEffect(() => {
    if (isErrorFriendList) {
      toast.error("친구 목록을 불러오는 중 에러가 발생했습니다.");
      return;
    }
  }, [isErrorFriendList, toast]);

  return {
    friendListData,
    searchNickname,
    filteredFriends,
    isErrorFriendList,
    isPendingFriendList,
    editPopupState,
    popupRef,
    modalState,
    modalType,
    setSearchNickname,
    setEditPopupState,
    setModalState,
    setModalType,
    handleToFriendAdd,
    handleClosePopup,
  };
}
