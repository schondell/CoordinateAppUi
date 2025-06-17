export interface Resource {
  id: number;
  name?: string;
  groupId?: number;
  description?: string;
  resourceType?: string;
  category?: string;
  unit?: string;
  unitPrice?: number;
  quantityAvailable?: number;
  quantityReserved?: number;
  minimumStock?: number;
  maximumStock?: number;
  location?: string;
  serialNumber?: string;
  barcode?: string;
  manufacturer?: string;
  model?: string;
  specifications?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  condition?: string;
  status?: string;
  isActive?: boolean;
  notes?: string;
  supplierId?: number;
  created?: Date;
  modified?: Date;
  createdByUserId?: number;
  modifiedByUserId?: number;
  isDeleted?: boolean;
}

export interface ResourceCreateRequest {
  name?: string;
  groupId?: number;
  description?: string;
  resourceType?: string;
  category?: string;
  unit?: string;
  unitPrice?: number;
  quantityAvailable?: number;
  quantityReserved?: number;
  minimumStock?: number;
  maximumStock?: number;
  location?: string;
  serialNumber?: string;
  barcode?: string;
  manufacturer?: string;
  model?: string;
  specifications?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  condition?: string;
  status?: string;
  isActive?: boolean;
  notes?: string;
  supplierId?: number;
}

export interface ResourceUpdateRequest {
  id: number;
  name?: string;
  groupId?: number;
  description?: string;
  resourceType?: string;
  category?: string;
  unit?: string;
  unitPrice?: number;
  quantityAvailable?: number;
  quantityReserved?: number;
  minimumStock?: number;
  maximumStock?: number;
  location?: string;
  serialNumber?: string;
  barcode?: string;
  manufacturer?: string;
  model?: string;
  specifications?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  condition?: string;
  status?: string;
  isActive?: boolean;
  notes?: string;
  supplierId?: number;
}

export interface ResourceSearchResponse {
  data: Resource[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}