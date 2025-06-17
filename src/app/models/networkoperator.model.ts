export interface NetworkOperator {
  networkOperatorId: number;
  id?: number; // Keep for backwards compatibility  
  countryId?: number;
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  addressId?: number;
  webUrl?: string;
  imageUrl?: string;
  vatNo?: string;
  apn?: string;
  apnUser?: string;
  apnUserPassword?: string;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface NetworkOperatorCreateRequest {
  countryId?: number;
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  addressId?: number;
  webUrl?: string;
  imageUrl?: string;
  vatNo?: string;
  apn?: string;
  apnUser?: string;
  apnUserPassword?: string;
}

export interface NetworkOperatorUpdateRequest {
  id: number;
  countryId?: number;
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  addressId?: number;
  webUrl?: string;
  imageUrl?: string;
  vatNo?: string;
  apn?: string;
  apnUser?: string;
  apnUserPassword?: string;
}

export interface NetworkOperatorSearchResponse {
  data: NetworkOperator[];
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