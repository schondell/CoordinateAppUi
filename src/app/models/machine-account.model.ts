export class MachineAccount {
  constructor(
    id?: string,
    userName?: string,
    fullName?: string,
    email?: string,
    machineName?: string,
    machineDescription?: string,
    clientId?: string,
    scopes?: string[],
    isActive?: boolean,
    lastAccessTime?: Date
  ) {
    this.id = id;
    this.userName = userName;
    this.fullName = fullName;
    this.email = email;
    this.machineName = machineName;
    this.machineDescription = machineDescription;
    this.clientId = clientId;
    this.scopes = scopes || [];
    this.isActive = isActive ?? true;
    this.lastAccessTime = lastAccessTime;
  }

  get friendlyName(): string {
    return this.machineName || this.fullName || this.userName || 'Unknown Machine';
  }

  get displayStatus(): string {
    if (!this.isActive) return 'Inactive';
    if (!this.isEnabled) return 'Disabled';
    return 'Active';
  }

  get lastAccessDisplayTime(): string {
    if (!this.lastAccessTime) return 'Never';
    return new Date(this.lastAccessTime).toLocaleString();
  }

  public id: string;
  public userName: string;
  public fullName: string;
  public email: string;
  public emailConfirmed: boolean;
  public isEnabled: boolean;
  public isActive: boolean;
  public isMachineAccount: boolean = true;
  
  // Machine-specific properties
  public machineName: string;
  public machineDescription: string;
  public clientId: string;
  public scopes: string[];
  public lastAccessTime?: Date;
  
  // Audit properties
  public createdBy: string;
  public createdDate: Date;
  public updatedBy: string;
  public updatedDate: Date;
}

export interface MachineAccountCreateRequest {
  userName: string;
  machineName: string;
  machineDescription: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  isActive: boolean;
}

export interface MachineAccountUpdateRequest {
  id: string;
  machineName: string;
  machineDescription: string;
  scopes: string[];
  isActive: boolean;
}

export interface MachineScope {
  name: string;
  displayName: string;
  description: string;
  category: 'Vehicle' | 'Events' | 'System' | 'General';
}

export const AvailableScopes: MachineScope[] = [
  { name: 'vehicle:read', displayName: 'Vehicle Data Read', description: 'Read access to vehicle location and status data', category: 'Vehicle' },
  { name: 'vehicle:write', displayName: 'Vehicle Data Write', description: 'Write access to submit vehicle location and status data', category: 'Vehicle' },
  { name: 'events:process', displayName: 'Event Processing', description: 'Access to process and submit tracking events', category: 'Events' },
  { name: 'system:monitor', displayName: 'System Monitoring', description: 'Access to system health and monitoring data', category: 'System' }
];