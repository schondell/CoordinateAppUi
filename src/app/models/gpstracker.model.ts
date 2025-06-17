export interface GpsTracker {
  id: number;
  vehicleId?: number;
  name?: string;
  trackerIdentification?: string;
  imeNumber?: string;
  gpsTrackerTypeId?: number;
  mobileSettingId?: number;
  trackerPassword?: string;
  simCardId?: number;
  isActive?: boolean;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface GpsTrackerCreateRequest {
  vehicleId?: number;
  name?: string;
  trackerIdentification?: string;
  imeNumber?: string;
  gpsTrackerTypeId?: number;
  mobileSettingId?: number;
  trackerPassword?: string;
  simCardId?: number;
  isActive?: boolean;
}

export interface GpsTrackerUpdateRequest {
  id: number;
  vehicleId?: number;
  name?: string;
  trackerIdentification?: string;
  imeNumber?: string;
  gpsTrackerTypeId?: number;
  mobileSettingId?: number;
  trackerPassword?: string;
  simCardId?: number;
  isActive?: boolean;
}

export interface GpsTrackerSearchResponse {
  data: GpsTracker[];
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