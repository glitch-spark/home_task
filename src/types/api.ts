export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export type ApplicationSortField = "followers" | "fitScore" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface ListApplicationsQuery {
  campaignId: string;
  status?: string;
  platform?: string;
  sort?: ApplicationSortField;
  order?: SortOrder;
}
