export interface Group {
  id: number;
  name: string;
  description?: string;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface GroupSearchResponse {
  data: Group[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}