export interface WorkOrder {
  id: number;
  orderNumber: string;
  title: string;
  description?: string;
  customerId: number;
  customerName?: string;
  vehicleId?: number;
  vehicleRegistration?: string;
  assignedTo?: number;
  assignedToName?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  location?: string;
  notes?: string;
  created: Date;
  createdBy: string;
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
  orderNumber: string;
  title: string;
  description?: string;
  customerId: number;
  vehicleId?: number;
  assignedTo?: number;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  estimatedHours?: number;
  estimatedCost?: number;
  scheduledDate?: Date;
  location?: string;
  notes?: string;
}

export interface WorkOrderUpdateRequest {
  id: number;
  orderNumber: string;
  title: string;
  description?: string;
  customerId: number;
  vehicleId?: number;
  assignedTo?: number;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  location?: string;
  notes?: string;
}