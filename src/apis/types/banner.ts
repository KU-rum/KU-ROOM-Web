import { ApiResponse } from ".";

export interface Banner {
  bannerId: number;
  bannerImageUrl: string;
  bannerLink: string;
}

export interface GetBannersResponse extends ApiResponse {
  data: Banner[];
}
