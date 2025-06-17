export interface Address {
  id: number;
  name?: string;
  groupId?: number;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  normalizedAddress?: string;
  timeZone?: string;
  geoHash?: string;
  description?: string;
  providerId?: number;
  createdForVehicleId?: number;
  firstTime?: Date;
  comment?: string;
  created?: Date;
  modified?: Date;
  createdByUserId?: number;
  modifiedByUserId?: number;
  isDeleted?: boolean;
}

export interface AddressCreateRequest {
  name?: string;
  groupId?: number;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  normalizedAddress?: string;
  timeZone?: string;
  geoHash?: string;
  description?: string;
  providerId?: number;
  createdForVehicleId?: number;
  firstTime?: Date;
  comment?: string;
}

export interface AddressUpdateRequest {
  id: number;
  name?: string;
  groupId?: number;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  normalizedAddress?: string;
  timeZone?: string;
  geoHash?: string;
  description?: string;
  providerId?: number;
  createdForVehicleId?: number;
  firstTime?: Date;
  comment?: string;
}

export interface AddressSearchResponse {
  data: Address[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}