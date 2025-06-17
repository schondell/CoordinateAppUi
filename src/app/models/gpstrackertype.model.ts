export interface GpsTrackerType {
  id: number;
  name: string;
  description?: string;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface GpsTrackerTypeSearchResponse {
  data: GpsTrackerType[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}