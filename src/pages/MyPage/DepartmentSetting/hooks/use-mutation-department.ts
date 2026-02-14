import { useMutation, useQueryClient } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import { addDepartmentApi, deleteDepartmentApi } from "@/apis/profile";

import { MYPAGE_QUERY_KEY } from "../../querykey";

export default function useMutationDepartment() {
  const toast = useToast();

  const qc = useQueryClient();

  const { mutate: addDepartment } = useMutation({
    mutationFn: (department: string) => addDepartmentApi(department),
    onSuccess: (response) => {
      qc.invalidateQueries({
        queryKey: MYPAGE_QUERY_KEY.USER_PROFILE,
      });
      toast.info(response);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteDepartment } = useMutation({
    mutationFn: (department: string) => deleteDepartmentApi(department),
    onSuccess: (response) => {
      qc.invalidateQueries({
        queryKey: MYPAGE_QUERY_KEY.USER_PROFILE,
      });
      toast.info(response);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    addDepartment,
    deleteDepartment,
  };
}
