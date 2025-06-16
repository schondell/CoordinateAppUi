export interface SimCard {
  id: number;
  name?: string;
  iccid?: string;
  imsi?: string;
  mobileNumber?: string;
  description?: string;
  isActive?: boolean;
  tenantId?: number;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface SimCardCreateRequest {
  name?: string;
  iccid?: string;
  imsi?: string;
  mobileNumber?: string;
  description?: string;
  isActive?: boolean;
}

export interface SimCardUpdateRequest {
  id: number;
  name?: string;
  iccid?: string;
  imsi?: string;
  mobileNumber?: string;
  description?: string;
  isActive?: boolean;
}

export interface SimCardSearchResponse {
  data: SimCard[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Syncfusion DataGrid models
export interface DataManagerRequest {
  skip: number;
  take: number;
  requiresCounts: boolean;
  sorted: Sort[];
  where: WhereFilter[];
  search: SearchFilter[];
}

export interface Sort {
  name: string;
  direction: string;
}

export interface WhereFilter {
  field: string;
  operator: string;
  value: any;
  predicate: string;
  matchCase: boolean;
  ignoreAccent: boolean;
}

export interface SearchFilter {
  fields: string[];
  operator: string;
  key: string;
  ignoreCase: boolean;
}

export interface DataManagerResponse<T> {
  result: T[];
  count: number;
}