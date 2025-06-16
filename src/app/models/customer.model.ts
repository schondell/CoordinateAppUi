export interface CustomerAddress {
  id: number;
  name: string;
  groupId?: number;
  created: Date;
  modified: Date;
  createdByUserId: number;
  modifiedByUserId?: number;
  isDeleted: boolean;
  tenantId: number;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  zip: string;
  state?: string;
  country?: string;
  longitude: number;
  latitude: number;
  normalizedAddress?: string;
  timeZone?: string;
  geoHash?: string;
  description?: string;
  providerId?: number;
  createdForVehicleId?: number;
  firstTime?: Date;
  comment?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  contact?: string;
  groupId?: number;
  addressId?: number;
  address?: CustomerAddress;
  webUrl?: string;
  imageUrl?: string;
  vatNo?: string;
  companyNo?: string;
  parentCustomer: number;
  created: Date;
  modified: Date;
  createdByUserId: number;
  modifiedByUserId?: number;
  isDeleted: boolean;
  tenantId: number;
  comment?: string;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  phone?: string;
  contact?: string;
  groupId?: number;
  addressId?: number;
  address?: CustomerAddress;
  webUrl?: string;
  imageUrl?: string;
  vatNo?: string;
  companyNo?: string;
  parentCustomer: number;
  comment?: string;
}

export interface CustomerUpdateRequest extends CustomerCreateRequest {
  id: number;
}

export interface CustomerSearchResponse {
  data: Customer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Syncfusion DataManager request/response interfaces
export interface DataManagerRequest {
  skip: number;
  take: number;
  requiresCounts: boolean;
  sorted?: Sort[];
  where?: WhereFilter[];
  search?: SearchFilter[];
}

export interface Sort {
  name: string;
  direction: string;
}

export interface WhereFilter {
  field: string;
  operator: string;
  value: any;
  predicate?: string;
  matchCase?: boolean;
  ignoreAccent?: boolean;
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