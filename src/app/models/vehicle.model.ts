export interface Vehicle {
  id: number;
  name?: string;
  licensePlateNumber?: string;
  vin?: string;
  make?: string;
  model?: string;
  vehicleYear?: number;
  isActive?: boolean;
  tenantId?: number;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface VehicleCreateRequest {
  name?: string;
  licensePlateNumber?: string;
  vin?: string;
  make?: string;
  model?: string;
  vehicleYear?: number;
  isActive?: boolean;
}

export interface VehicleUpdateRequest {
  id: number;
  name?: string;
  licensePlateNumber?: string;
  vin?: string;
  make?: string;
  model?: string;
  vehicleYear?: number;
  isActive?: boolean;
}

export interface VehicleSearchResponse {
  data: Vehicle[];
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