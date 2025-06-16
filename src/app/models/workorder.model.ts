export interface WorkOrder {
  id: number;
  title: string;
  description?: string;
  started?: Date;
  ended?: Date;
  tenantId?: number;
  created?: Date;
  createdBy?: string;
  modified?: Date;
  modifiedBy?: string;
}

export enum WorkOrderStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum WorkOrderPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface WorkOrderCreateRequest {
  title: string;
  description?: string;
  started?: Date;
  ended?: Date;
}

export interface WorkOrderUpdateRequest {
  id: number;
  title: string;
  description?: string;
  started?: Date;
  ended?: Date;
}

export interface WorkOrderSearchResponse {
  data: WorkOrder[];
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