export interface MobileSetting {
  id: number;
  name: string;
  description?: string;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface MobileSettingSearchResponse {
  data: MobileSetting[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}