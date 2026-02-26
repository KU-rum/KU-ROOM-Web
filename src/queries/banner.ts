import { useQuery } from "@tanstack/react-query";
import { getBannersApi } from "@apis/banner";
import { BANNER_QUERY_KEY } from "@/queryKey";

export const useBannersQuery = () => {
  const {
    data,
    isPending: isPendingBanner,
    isError: isErrorBanner,
  } = useQuery({
    queryKey: BANNER_QUERY_KEY.DEFAULT,
    queryFn: () => getBannersApi(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 90,
  });

  const bannerData = data?.data;

  return {
    bannerData,
    isPendingBanner,
    isErrorBanner,
  };
};
