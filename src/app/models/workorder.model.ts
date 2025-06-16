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