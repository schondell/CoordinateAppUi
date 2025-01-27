//module Coordinate {

	export interface ISprint {
		sprintId: number;
		userId: number;
		resource: IResource;
		name: string;
		startAt: Date;
		endAt: Date;
		plannedDistance: string;
		plannedDrivingTime: number;
		sprintItems: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class Sprint implements ISprint{
		sprintId: number;
		userId: number;
		resource: IResource;
		name: string;
		startAt: Date;
		endAt: Date;
		plannedDistance: string;
		plannedDrivingTime: number;
		sprintItems: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface ISprintApi
	{
		 sprints: ISprint[];
		 totalCount: number;
	}
	export interface ISprintDto {
		sprintId: number;
		userId: number;
		resourceId: number;
		name: string;
		startAt: Date;
		endAt: Date;
		plannedDistance: string;
		plannedDrivingTime: number;
		sprintItems: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class SprintDto implements ISprintDto{
		sprintId: number;
		userId: number;
		resourceId: number;
		name: string;
		startAt: Date;
		endAt: Date;
		plannedDistance: string;
		plannedDrivingTime: number;
		sprintItems: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface ISprintDtoApi
	{
		 sprintDtos: ISprintDto[];
		 totalCount: number;
	}
	export interface ITenant {
		name: string;
		tenantType: ITenantType;
		imageUrl: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		address: IAddress;
		adminUser: IUser;
		webUrl: string;
		eventHubName: string;
		saS: string;
		retailerType: IRetailerType;
		image: IImage;

}

	export class Tenant implements ITenant{
		name: string;
		tenantType: ITenantType;
		imageUrl: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		address: IAddress;
		adminUser: IUser;
		webUrl: string;
		eventHubName: string;
		saS: string;
		retailerType: IRetailerType;
		image: IImage;
}
	export interface ITenantApi
	{
		 tenants: ITenant[];
		 totalCount: number;
	}
	export interface ITenantDto {
		name: string;
		tenantTypeId: number;
		imageUrl: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		addressId: number;
		adminUserId: number;
		webUrl: string;
		eventHubName: string;
		saS: string;
		retailerTypeId: number;
		imageId: number;

}

	export class TenantDto implements ITenantDto{
		name: string;
		tenantTypeId: number;
		imageUrl: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		addressId: number;
		adminUserId: number;
		webUrl: string;
		eventHubName: string;
		saS: string;
		retailerTypeId: number;
		imageId: number;
}
	export interface ITenantDtoApi
	{
		 tenantDtos: ITenantDto[];
		 totalCount: number;
	}
	export interface ITenantGroup {
		tenantGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;

}

	export class TenantGroup implements ITenantGroup{
		tenantGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;
}
	export interface ITenantGroupApi
	{
		 tenantGroups: ITenantGroup[];
		 totalCount: number;
	}
	export interface ITenantGroupDto {
		tenantGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;

}

	export class TenantGroupDto implements ITenantGroupDto{
		tenantGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;
}
	export interface ITenantGroupDtoApi
	{
		 tenantGroupDtos: ITenantGroupDto[];
		 totalCount: number;
	}
	export interface ITenantInvitation {
		tenantInvitationId: number;
		name: string;
		uniqueGuid: string;
		phone: string;
		street: string;
		city: string;
		zip: string;
		registationNo: string;
		email: string;
		created: Date;
		accepted: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		contactRequested: boolean;
		removeMeFromEmails: boolean;
		webUrl: string;

}

	export class TenantInvitation implements ITenantInvitation{
		tenantInvitationId: number;
		name: string;
		uniqueGuid: string;
		phone: string;
		street: string;
		city: string;
		zip: string;
		registationNo: string;
		email: string;
		created: Date;
		accepted: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		contactRequested: boolean;
		removeMeFromEmails: boolean;
		webUrl: string;
}
	export interface ITenantInvitationApi
	{
		 tenantInvitations: ITenantInvitation[];
		 totalCount: number;
	}
	export interface ITenantInvitationDto {
		tenantInvitationId: number;
		name: string;
		uniqueGuid: string;
		phone: string;
		street: string;
		city: string;
		zip: string;
		registationNo: string;
		email: string;
		created: Date;
		accepted: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		contactRequested: boolean;
		removeMeFromEmails: boolean;
		webUrl: string;

}

	export class TenantInvitationDto implements ITenantInvitationDto{
		tenantInvitationId: number;
		name: string;
		uniqueGuid: string;
		phone: string;
		street: string;
		city: string;
		zip: string;
		registationNo: string;
		email: string;
		created: Date;
		accepted: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		contactRequested: boolean;
		removeMeFromEmails: boolean;
		webUrl: string;
}
	export interface ITenantInvitationDtoApi
	{
		 tenantInvitationDtos: ITenantInvitationDto[];
		 totalCount: number;
	}
	export interface ITenantType {
		tenantTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class TenantType implements ITenantType{
		tenantTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface ITenantTypeApi
	{
		 tenantTypes: ITenantType[];
		 totalCount: number;
	}
	export interface ITenantTypeDto {
		tenantTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class TenantTypeDto implements ITenantTypeDto{
		tenantTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface ITenantTypeDtoApi
	{
		 tenantTypeDtos: ITenantTypeDto[];
		 totalCount: number;
	}
	export interface ITyreLog {
		tyreLogId: number;
		vehicleMaintenanceLogType: IVehicleMaintenanceLogType;
		vehicle: IVehicle;
		odometerReading: number;
		image: IImage;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;

}

	export class TyreLog implements ITyreLog{
		tyreLogId: number;
		vehicleMaintenanceLogType: IVehicleMaintenanceLogType;
		vehicle: IVehicle;
		odometerReading: number;
		image: IImage;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;
}
	export interface ITyreLogApi
	{
		 tyreLogs: ITyreLog[];
		 totalCount: number;
	}
	export interface ITyreLogDto {
		tyreLogId: number;
		vehicleMaintenanceLogTypeId: number;
		vehicleId: number;
		odometerReading: number;
		imageId: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;

}

	export class TyreLogDto implements ITyreLogDto{
		tyreLogId: number;
		vehicleMaintenanceLogTypeId: number;
		vehicleId: number;
		odometerReading: number;
		imageId: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;
}
	export interface ITyreLogDtoApi
	{
		 tyreLogDtos: ITyreLogDto[];
		 totalCount: number;
	}
	export interface IUserGroup {
		userGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class UserGroup implements IUserGroup{
		userGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IUserGroupApi
	{
		 userGroups: IUserGroup[];
		 totalCount: number;
	}
	export interface IUserGroupDto {
		userGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class UserGroupDto implements IUserGroupDto{
		userGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IUserGroupDtoApi
	{
		 userGroupDtos: IUserGroupDto[];
		 totalCount: number;
	}
	export interface IUserType {
		userTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class UserType implements IUserType{
		userTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IUserTypeApi
	{
		 userTypes: IUserType[];
		 totalCount: number;
	}
	export interface IUserTypeDto {
		userTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class UserTypeDto implements IUserTypeDto{
		userTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IUserTypeDtoApi
	{
		 userTypeDtos: IUserTypeDto[];
		 totalCount: number;
	}
	export interface IVehicleMaintenanceLog {
		vehicleMaintenanceLogId: number;
		vehicleMaintenanceLogType: IVehicleMaintenanceLogType;
		vehicle: IVehicle;
		odometerReading: number;
		image: IImage;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;

}

	export class VehicleMaintenanceLog implements IVehicleMaintenanceLog{
		vehicleMaintenanceLogId: number;
		vehicleMaintenanceLogType: IVehicleMaintenanceLogType;
		vehicle: IVehicle;
		odometerReading: number;
		image: IImage;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;
}
	export interface IVehicleMaintenanceLogApi
	{
		 vehicleMaintenanceLogs: IVehicleMaintenanceLog[];
		 totalCount: number;
	}
	export interface IVehicleMaintenanceLogDto {
		vehicleMaintenanceLogId: number;
		vehicleMaintenanceLogTypeId: number;
		vehicleId: number;
		odometerReading: number;
		imageId: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;

}

	export class VehicleMaintenanceLogDto implements IVehicleMaintenanceLogDto{
		vehicleMaintenanceLogId: number;
		vehicleMaintenanceLogTypeId: number;
		vehicleId: number;
		odometerReading: number;
		imageId: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;
}
	export interface IVehicleMaintenanceLogDtoApi
	{
		 vehicleMaintenanceLogDtos: IVehicleMaintenanceLogDto[];
		 totalCount: number;
	}
	export interface IVehicleMaintenanceLogType {
		vehicleMaintenanceLogTypeId: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;

}

	export class VehicleMaintenanceLogType implements IVehicleMaintenanceLogType{
		vehicleMaintenanceLogTypeId: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;
}
	export interface IVehicleMaintenanceLogTypeApi
	{
		 vehicleMaintenanceLogTypes: IVehicleMaintenanceLogType[];
		 totalCount: number;
	}
	export interface IVehicleMaintenanceLogTypeDto {
		vehicleMaintenanceLogTypeId: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;

}

	export class VehicleMaintenanceLogTypeDto implements IVehicleMaintenanceLogTypeDto{
		vehicleMaintenanceLogTypeId: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;
}
	export interface IVehicleMaintenanceLogTypeDtoApi
	{
		 vehicleMaintenanceLogTypeDtos: IVehicleMaintenanceLogTypeDto[];
		 totalCount: number;
	}
	export interface IVehicleOdometerReading {
		vehicleOdometerReadingId: number;
		vehicle: IVehicle;
		name: string;
		reading: number;
		unitIdentity: number;
		trackerValue: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;

}

	export class VehicleOdometerReading implements IVehicleOdometerReading{
		vehicleOdometerReadingId: number;
		vehicle: IVehicle;
		name: string;
		reading: number;
		unitIdentity: number;
		trackerValue: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;
}
	export interface IVehicleOdometerReadingApi
	{
		 vehicleOdometerReadings: IVehicleOdometerReading[];
		 totalCount: number;
	}
	export interface IVehicleOdometerReadingDto {
		vehicleOdometerReadingId: number;
		vehicleId: number;
		name: string;
		reading: number;
		unitIdentity: number;
		trackerValue: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;

}

	export class VehicleOdometerReadingDto implements IVehicleOdometerReadingDto{
		vehicleOdometerReadingId: number;
		vehicleId: number;
		name: string;
		reading: number;
		unitIdentity: number;
		trackerValue: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;
}
	export interface IVehicleOdometerReadingDtoApi
	{
		 vehicleOdometerReadingDtos: IVehicleOdometerReadingDto[];
		 totalCount: number;
	}
	export interface IVehicleTripBaseType {
		vehicleTripBaseTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class VehicleTripBaseType implements IVehicleTripBaseType{
		vehicleTripBaseTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IVehicleTripBaseTypeApi
	{
		 vehicleTripBaseTypes: IVehicleTripBaseType[];
		 totalCount: number;
	}
	export interface IVehicleTripBaseTypeDto {
		vehicleTripBaseTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class VehicleTripBaseTypeDto implements IVehicleTripBaseTypeDto{
		vehicleTripBaseTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IVehicleTripBaseTypeDtoApi
	{
		 vehicleTripBaseTypeDtos: IVehicleTripBaseTypeDto[];
		 totalCount: number;
	}
	export interface IVehicleTripType {
		vehicleTripTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		vehicleTripBaseType: IVehicleTripBaseType;

}

	export class VehicleTripType implements IVehicleTripType{
		vehicleTripTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		vehicleTripBaseType: IVehicleTripBaseType;
}
	export interface IVehicleTripTypeApi
	{
		 vehicleTripTypes: IVehicleTripType[];
		 totalCount: number;
	}
	export interface IVehicleTripTypeDto {
		vehicleTripTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		vehicleTripBaseTypeId: number;

}

	export class VehicleTripTypeDto implements IVehicleTripTypeDto{
		vehicleTripTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		vehicleTripBaseTypeId: number;
}
	export interface IVehicleTripTypeDtoApi
	{
		 vehicleTripTypeDtos: IVehicleTripTypeDto[];
		 totalCount: number;
	}
	export interface IAddress {
		addressId: number;
		name: string;
		address1: string;
		address2: string;
		address3: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		searchFormat: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		timeZone: string;
		geoHash: string;
		image: IImage;
		description: string;
		provider: string;
		createdForVehicle: number;
		firstTime: Date;

}

	export class Address implements IAddress{
		addressId: number;
		name: string;
		address1: string;
		address2: string;
		address3: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		searchFormat: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		timeZone: string;
		geoHash: string;
		image: IImage;
		description: string;
		provider: string;
		createdForVehicle: number;
		firstTime: Date;
}
	export interface IAddressApi
	{
		 addresss: IAddress[];
		 totalCount: number;
	}
	export interface IAddressDto {
		addressId: number;
		name: string;
		address1: string;
		address2: string;
		address3: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		searchFormat: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		timeZone: string;
		geoHash: string;
		imageId: number;
		description: string;
		provider: string;
		createdForVehicle: number;
		firstTime: Date;

}

	export class AddressDto implements IAddressDto{
		addressId: number;
		name: string;
		address1: string;
		address2: string;
		address3: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		searchFormat: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		timeZone: string;
		geoHash: string;
		imageId: number;
		description: string;
		provider: string;
		createdForVehicle: number;
		firstTime: Date;
}
	export interface IAddressDtoApi
	{
		 addressDtos: IAddressDto[];
		 totalCount: number;
	}
	export interface IVehicleType {
		vehicleTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class VehicleType implements IVehicleType{
		vehicleTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IVehicleTypeApi
	{
		 vehicleTypes: IVehicleType[];
		 totalCount: number;
	}
	export interface IVehicleTypeDto {
		vehicleTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class VehicleTypeDto implements IVehicleTypeDto{
		vehicleTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IVehicleTypeDtoApi
	{
		 vehicleTypeDtos: IVehicleTypeDto[];
		 totalCount: number;
	}
	export interface ISinoCastelObd2Alarm {
		sinoCastelObd2AlarmId: number;
		vehicle: IVehicle;
		deviceIdentity: string;
		messageTypeStrong: number;
		description: string;
		longitude: number;
		latitude: number;
		geoHash: string;
		speed: number;
		heading: number;
		latestAccOnTime: Date;
		totalTripMilage: number;
		currentTripMileage: number;
		totalFuelConsumption: number;
		currentTripFuelConsumption: number;
		alarm: string;
		deviceTimestamp: Date;
		created: Date;
		modified: Date;
		correlationIdentity: string;
		day: number;
		month: number;
		year: number;

}

	export class SinoCastelObd2Alarm implements ISinoCastelObd2Alarm{
		sinoCastelObd2AlarmId: number;
		vehicle: IVehicle;
		deviceIdentity: string;
		messageTypeStrong: number;
		description: string;
		longitude: number;
		latitude: number;
		geoHash: string;
		speed: number;
		heading: number;
		latestAccOnTime: Date;
		totalTripMilage: number;
		currentTripMileage: number;
		totalFuelConsumption: number;
		currentTripFuelConsumption: number;
		alarm: string;
		deviceTimestamp: Date;
		created: Date;
		modified: Date;
		correlationIdentity: string;
		day: number;
		month: number;
		year: number;
}
	export interface ISinoCastelObd2AlarmApi
	{
		 sinoCastelObd2Alarms: ISinoCastelObd2Alarm[];
		 totalCount: number;
	}
	export interface ISinoCastelObd2AlarmDto {
		sinoCastelObd2AlarmId: number;
		vehicleId: number;
		deviceIdentity: string;
		messageTypeStrong: number;
		description: string;
		longitude: number;
		latitude: number;
		geoHash: string;
		speed: number;
		heading: number;
		latestAccOnTime: Date;
		totalTripMilage: number;
		currentTripMileage: number;
		totalFuelConsumption: number;
		currentTripFuelConsumption: number;
		alarm: string;
		deviceTimestamp: Date;
		created: Date;
		modified: Date;
		correlationIdentity: string;
		day: number;
		month: number;
		year: number;

}

	export class SinoCastelObd2AlarmDto implements ISinoCastelObd2AlarmDto{
		sinoCastelObd2AlarmId: number;
		vehicleId: number;
		deviceIdentity: string;
		messageTypeStrong: number;
		description: string;
		longitude: number;
		latitude: number;
		geoHash: string;
		speed: number;
		heading: number;
		latestAccOnTime: Date;
		totalTripMilage: number;
		currentTripMileage: number;
		totalFuelConsumption: number;
		currentTripFuelConsumption: number;
		alarm: string;
		deviceTimestamp: Date;
		created: Date;
		modified: Date;
		correlationIdentity: string;
		day: number;
		month: number;
		year: number;
}
	export interface ISinoCastelObd2AlarmDtoApi
	{
		 sinoCastelObd2AlarmDtos: ISinoCastelObd2AlarmDto[];
		 totalCount: number;
	}
	export interface IWebVisitHistory {
		webVisitHistoryId: number;
		ipAdress: string;
		domain: string;
		countryCode: string;
		countryName: string;
		regionCode: string;
		regionName: string;
		city: string;
		zipCode: string;
		timeZone: string;
		latitude: number;
		longitude: number;
		metro_code: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		address: IAddress;
		adminUser: IUser;
		geoHash: string;

}

	export class WebVisitHistory implements IWebVisitHistory{
		webVisitHistoryId: number;
		ipAdress: string;
		domain: string;
		countryCode: string;
		countryName: string;
		regionCode: string;
		regionName: string;
		city: string;
		zipCode: string;
		timeZone: string;
		latitude: number;
		longitude: number;
		metro_code: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		address: IAddress;
		adminUser: IUser;
		geoHash: string;
}
	export interface IWebVisitHistoryApi
	{
		 webVisitHistorys: IWebVisitHistory[];
		 totalCount: number;
	}
	export interface IWebVisitHistoryDto {
		webVisitHistoryId: number;
		ipAdress: string;
		domain: string;
		countryCode: string;
		countryName: string;
		regionCode: string;
		regionName: string;
		city: string;
		zipCode: string;
		timeZone: string;
		latitude: number;
		longitude: number;
		metro_code: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		addressId: number;
		adminUserId: number;
		geoHash: string;

}

	export class WebVisitHistoryDto implements IWebVisitHistoryDto{
		webVisitHistoryId: number;
		ipAdress: string;
		domain: string;
		countryCode: string;
		countryName: string;
		regionCode: string;
		regionName: string;
		city: string;
		zipCode: string;
		timeZone: string;
		latitude: number;
		longitude: number;
		metro_code: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		addressId: number;
		adminUserId: number;
		geoHash: string;
}
	export interface IWebVisitHistoryDtoApi
	{
		 webVisitHistoryDtos: IWebVisitHistoryDto[];
		 totalCount: number;
	}
	export interface IWorkItemHistory {
		workItemHistoryId: number;
		value: string;
		workItemStateJson: string;
		workItem: IWorkItem;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class WorkItemHistory implements IWorkItemHistory{
		workItemHistoryId: number;
		value: string;
		workItemStateJson: string;
		workItem: IWorkItem;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IWorkItemHistoryApi
	{
		 workItemHistorys: IWorkItemHistory[];
		 totalCount: number;
	}
	export interface IWorkItemHistoryDto {
		workItemHistoryId: number;
		value: string;
		workItemStateJson: string;
		workItemId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class WorkItemHistoryDto implements IWorkItemHistoryDto{
		workItemHistoryId: number;
		value: string;
		workItemStateJson: string;
		workItemId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IWorkItemHistoryDtoApi
	{
		 workItemHistoryDtos: IWorkItemHistoryDto[];
		 totalCount: number;
	}
	export interface ITenantSite {
		tenantSiteId: number;
		name: string;
		imageUrl: string;
		address: IAddress;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		userTitle: string;
		image: IImage;

}

	export class TenantSite implements ITenantSite{
		tenantSiteId: number;
		name: string;
		imageUrl: string;
		address: IAddress;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		userTitle: string;
		image: IImage;
}
	export interface ITenantSiteApi
	{
		 tenantSites: ITenantSite[];
		 totalCount: number;
	}
	export interface ITenantSiteDto {
		tenantSiteId: number;
		name: string;
		imageUrl: string;
		addressId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		userTitle: string;
		imageId: number;

}

	export class TenantSiteDto implements ITenantSiteDto{
		tenantSiteId: number;
		name: string;
		imageUrl: string;
		addressId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		userTitle: string;
		imageId: number;
}
	export interface ITenantSiteDtoApi
	{
		 tenantSiteDtos: ITenantSiteDto[];
		 totalCount: number;
	}
	export interface IVehicleTripLog {
		vehicleTripLogId: number;
		vehicle: IVehicle;
		userId: number;
		workItem: IWorkItem;
		distance: number;
		started: Date;
		ended: Date;
		odometerStart: number;
		odometerEnd: number;
		description: string;
		startedAt: number;
		endedAt: number;
		vehicleTripType: IVehicleTripType;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;
		fuelConsumption: number;
		estimatedDistance: number;
		estimatedTime: number;
		durationInMinutes: number;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		day: number;
		month: number;
		year: number;

}

	export class VehicleTripLog implements IVehicleTripLog{
		vehicleTripLogId: number;
		vehicle: IVehicle;
		userId: number;
		workItem: IWorkItem;
		distance: number;
		started: Date;
		ended: Date;
		odometerStart: number;
		odometerEnd: number;
		description: string;
		startedAt: number;
		endedAt: number;
		vehicleTripType: IVehicleTripType;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		title: string;
		fuelConsumption: number;
		estimatedDistance: number;
		estimatedTime: number;
		durationInMinutes: number;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		day: number;
		month: number;
		year: number;
}
	export interface IVehicleTripLogApi
	{
		 vehicleTripLogs: IVehicleTripLog[];
		 totalCount: number;
	}
	export interface IVehicleTripLogDto {
		vehicleTripLogId: number;
		vehicleId: number;
		userId: number;
		workItemId: number;
		distance: number;
		started: Date;
		ended: Date;
		odometerStart: number;
		odometerEnd: number;
		description: string;
		startedAt: number;
		endedAt: number;
		vehicleTripTypeId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;
		fuelConsumption: number;
		estimatedDistance: number;
		estimatedTime: number;
		durationInMinutes: number;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		day: number;
		month: number;
		year: number;

}

	export class VehicleTripLogDto implements IVehicleTripLogDto{
		vehicleTripLogId: number;
		vehicleId: number;
		userId: number;
		workItemId: number;
		distance: number;
		started: Date;
		ended: Date;
		odometerStart: number;
		odometerEnd: number;
		description: string;
		startedAt: number;
		endedAt: number;
		vehicleTripTypeId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		title: string;
		fuelConsumption: number;
		estimatedDistance: number;
		estimatedTime: number;
		durationInMinutes: number;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		day: number;
		month: number;
		year: number;
}
	export interface IVehicleTripLogDtoApi
	{
		 vehicleTripLogDtos: IVehicleTripLogDto[];
		 totalCount: number;
	}
	export interface IAccountGroup {
		accountGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class AccountGroup implements IAccountGroup{
		accountGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IAccountGroupApi
	{
		 accountGroups: IAccountGroup[];
		 totalCount: number;
	}
	export interface IAccountGroupDto {
		accountGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class AccountGroupDto implements IAccountGroupDto{
		accountGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IAccountGroupDtoApi
	{
		 accountGroupDtos: IAccountGroupDto[];
		 totalCount: number;
	}
	export interface ICountry {
		countryId: number;
		internationalCode: number;
		name: string;
		iSOCOde: string;
		localName: string;
		processed: Date;
		isProcessed: boolean;
		ignore: boolean;
		created: Date;
		createdByUser: IUser;
		modified: Date;
		modifiedByUser: IUser;

}

	export class Country implements ICountry{
		countryId: number;
		internationalCode: number;
		name: string;
		iSOCOde: string;
		localName: string;
		processed: Date;
		isProcessed: boolean;
		ignore: boolean;
		created: Date;
		createdByUser: IUser;
		modified: Date;
		modifiedByUser: IUser;
}
	export interface ICountryApi
	{
		 countrys: ICountry[];
		 totalCount: number;
	}
	export interface ICountryDto {
		countryId: number;
		internationalCode: number;
		name: string;
		iSOCOde: string;
		localName: string;
		processed: Date;
		isProcessed: boolean;
		ignore: boolean;
		created: Date;
		createdByUserId: number;
		modified: Date;
		modifiedByUserId: number;

}

	export class CountryDto implements ICountryDto{
		countryId: number;
		internationalCode: number;
		name: string;
		iSOCOde: string;
		localName: string;
		processed: Date;
		isProcessed: boolean;
		ignore: boolean;
		created: Date;
		createdByUserId: number;
		modified: Date;
		modifiedByUserId: number;
}
	export interface ICountryDtoApi
	{
		 countryDtos: ICountryDto[];
		 totalCount: number;
	}
	export interface ICustomer {
		customerId: number;
		customerType: ICustomerType;
		name: string;
		email: string;
		phone: string;
		contact: string;
		address: IAddress;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		dummyJustForCodeGenerator: boolean;
		image: IImage;

}

	export class Customer implements ICustomer{
		customerId: number;
		customerType: ICustomerType;
		name: string;
		email: string;
		phone: string;
		contact: string;
		address: IAddress;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		dummyJustForCodeGenerator: boolean;
		image: IImage;
}
	export interface ICustomerApi
	{
		 customers: ICustomer[];
		 totalCount: number;
	}
	export interface ICustomerDto {
		customerId: number;
		customerTypeId: number;
		name: string;
		email: string;
		phone: string;
		contact: string;
		addressId: number;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		dummyJustForCodeGenerator: boolean;
		imageId: number;

}

	export class CustomerDto implements ICustomerDto{
		customerId: number;
		customerTypeId: number;
		name: string;
		email: string;
		phone: string;
		contact: string;
		addressId: number;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		dummyJustForCodeGenerator: boolean;
		imageId: number;
}
	export interface ICustomerDtoApi
	{
		 customerDtos: ICustomerDto[];
		 totalCount: number;
	}
	export interface ICustomerAccount {
		customerAccountId: number;
		name: string;
		customer: ICustomer;
		value: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class CustomerAccount implements ICustomerAccount{
		customerAccountId: number;
		name: string;
		customer: ICustomer;
		value: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface ICustomerAccountApi
	{
		 customerAccounts: ICustomerAccount[];
		 totalCount: number;
	}
	export interface ICustomerAccountDto {
		customerAccountId: number;
		name: string;
		customerId: number;
		value: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class CustomerAccountDto implements ICustomerAccountDto{
		customerAccountId: number;
		name: string;
		customerId: number;
		value: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface ICustomerAccountDtoApi
	{
		 customerAccountDtos: ICustomerAccountDto[];
		 totalCount: number;
	}
	export interface IWorkItem {
		workItemId: number;
		workItemType: IWorkItemType;
		customer: ICustomer;
		sprint: ISprint;
		title: string;
		description: string;
		assignedToUser: IUser;
		estimatedWork: string;
		workDone: string;
		workItemStatus: IWorkItemStatus;
		workItemPriority: IWorkItemPriority;
		estimatedStart: Date;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isPlanned: boolean;
		waterMark: number;
		travelTime: string;

}

	export class WorkItem implements IWorkItem{
		workItemId: number;
		workItemType: IWorkItemType;
		customer: ICustomer;
		sprint: ISprint;
		title: string;
		description: string;
		assignedToUser: IUser;
		estimatedWork: string;
		workDone: string;
		workItemStatus: IWorkItemStatus;
		workItemPriority: IWorkItemPriority;
		estimatedStart: Date;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isPlanned: boolean;
		waterMark: number;
		travelTime: string;
}
	export interface IWorkItemApi
	{
		 workItems: IWorkItem[];
		 totalCount: number;
	}
	export interface IWorkItemDto {
		workItemId: number;
		workItemTypeId: number;
		customerId: number;
		sprintId: number;
		title: string;
		description: string;
		assignedToUserId: number;
		estimatedWork: string;
		workDone: string;
		workItemStatusId: number;
		workItemPriorityId: number;
		estimatedStart: Date;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isPlanned: boolean;
		waterMark: number;
		travelTime: string;

}

	export class WorkItemDto implements IWorkItemDto{
		workItemId: number;
		workItemTypeId: number;
		customerId: number;
		sprintId: number;
		title: string;
		description: string;
		assignedToUserId: number;
		estimatedWork: string;
		workDone: string;
		workItemStatusId: number;
		workItemPriorityId: number;
		estimatedStart: Date;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isPlanned: boolean;
		waterMark: number;
		travelTime: string;
}
	export interface IWorkItemDtoApi
	{
		 workItemDtos: IWorkItemDto[];
		 totalCount: number;
	}
	export interface ICustomerGroup {
		customerGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class CustomerGroup implements ICustomerGroup{
		customerGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface ICustomerGroupApi
	{
		 customerGroups: ICustomerGroup[];
		 totalCount: number;
	}
	export interface ICustomerGroupDto {
		customerGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class CustomerGroupDto implements ICustomerGroupDto{
		customerGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface ICustomerGroupDtoApi
	{
		 customerGroupDtos: ICustomerGroupDto[];
		 totalCount: number;
	}
	export interface IWorkItemBaseStatus {
		workItemBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class WorkItemBaseStatus implements IWorkItemBaseStatus{
		workItemBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IWorkItemBaseStatusApi
	{
		 workItemBaseStatuss: IWorkItemBaseStatus[];
		 totalCount: number;
	}
	export interface IWorkItemBaseStatusDto {
		workItemBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class WorkItemBaseStatusDto implements IWorkItemBaseStatusDto{
		workItemBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IWorkItemBaseStatusDtoApi
	{
		 workItemBaseStatusDtos: IWorkItemBaseStatusDto[];
		 totalCount: number;
	}
	export interface ICustomerProperty {
		customerPropertyId: number;
		customer: ICustomer;
		name: string;
		value: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class CustomerProperty implements ICustomerProperty{
		customerPropertyId: number;
		customer: ICustomer;
		name: string;
		value: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface ICustomerPropertyApi
	{
		 customerPropertys: ICustomerProperty[];
		 totalCount: number;
	}
	export interface ICustomerPropertyDto {
		customerPropertyId: number;
		customerId: number;
		name: string;
		value: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class CustomerPropertyDto implements ICustomerPropertyDto{
		customerPropertyId: number;
		customerId: number;
		name: string;
		value: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface ICustomerPropertyDtoApi
	{
		 customerPropertyDtos: ICustomerPropertyDto[];
		 totalCount: number;
	}
	export interface IWorkItemPriority {
		workItemPriorityId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class WorkItemPriority implements IWorkItemPriority{
		workItemPriorityId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IWorkItemPriorityApi
	{
		 workItemPrioritys: IWorkItemPriority[];
		 totalCount: number;
	}
	export interface IWorkItemPriorityDto {
		workItemPriorityId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class WorkItemPriorityDto implements IWorkItemPriorityDto{
		workItemPriorityId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IWorkItemPriorityDtoApi
	{
		 workItemPriorityDtos: IWorkItemPriorityDto[];
		 totalCount: number;
	}
	export interface ICustomerType {
		customerTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class CustomerType implements ICustomerType{
		customerTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface ICustomerTypeApi
	{
		 customerTypes: ICustomerType[];
		 totalCount: number;
	}
	export interface ICustomerTypeDto {
		customerTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class CustomerTypeDto implements ICustomerTypeDto{
		customerTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface ICustomerTypeDtoApi
	{
		 customerTypeDtos: ICustomerTypeDto[];
		 totalCount: number;
	}
	export interface IWorkItemStatus {
		workItemStatusId: number;
		name: string;
		workItemBaseStatus: IWorkItemBaseStatus;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class WorkItemStatus implements IWorkItemStatus{
		workItemStatusId: number;
		name: string;
		workItemBaseStatus: IWorkItemBaseStatus;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IWorkItemStatusApi
	{
		 workItemStatuss: IWorkItemStatus[];
		 totalCount: number;
	}
	export interface IWorkItemStatusDto {
		workItemStatusId: number;
		name: string;
		workItemBaseStatusId: number;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class WorkItemStatusDto implements IWorkItemStatusDto{
		workItemStatusId: number;
		name: string;
		workItemBaseStatusId: number;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IWorkItemStatusDtoApi
	{
		 workItemStatusDtos: IWorkItemStatusDto[];
		 totalCount: number;
	}
	export interface IGpsTrackerSmsCommand {
		gpsTrackerSmsCommandId: number;
		gpsTrackerType: IGpsTrackerType;
		name: string;
		command: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class GpsTrackerSmsCommand implements IGpsTrackerSmsCommand{
		gpsTrackerSmsCommandId: number;
		gpsTrackerType: IGpsTrackerType;
		name: string;
		command: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IGpsTrackerSmsCommandApi
	{
		 gpsTrackerSmsCommands: IGpsTrackerSmsCommand[];
		 totalCount: number;
	}
	export interface IGpsTrackerSmsCommandDto {
		gpsTrackerSmsCommandId: number;
		gpsTrackerTypeId: number;
		name: string;
		command: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class GpsTrackerSmsCommandDto implements IGpsTrackerSmsCommandDto{
		gpsTrackerSmsCommandId: number;
		gpsTrackerTypeId: number;
		name: string;
		command: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IGpsTrackerSmsCommandDtoApi
	{
		 gpsTrackerSmsCommandDtos: IGpsTrackerSmsCommandDto[];
		 totalCount: number;
	}
	export interface IGpsTrackerType {
		gpsTrackerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;
		isObd2: boolean;
		defaultPassword: string;
		vendorUrl: string;
		dataSheetUrl: string;
		protocolDocUrl: string;

}

	export class GpsTrackerType implements IGpsTrackerType{
		gpsTrackerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;
		isObd2: boolean;
		defaultPassword: string;
		vendorUrl: string;
		dataSheetUrl: string;
		protocolDocUrl: string;
}
	export interface IGpsTrackerTypeApi
	{
		 gpsTrackerTypes: IGpsTrackerType[];
		 totalCount: number;
	}
	export interface IGpsTrackerTypeDto {
		gpsTrackerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;
		isObd2: boolean;
		defaultPassword: string;
		vendorUrl: string;
		dataSheetUrl: string;
		protocolDocUrl: string;

}

	export class GpsTrackerTypeDto implements IGpsTrackerTypeDto{
		gpsTrackerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;
		isObd2: boolean;
		defaultPassword: string;
		vendorUrl: string;
		dataSheetUrl: string;
		protocolDocUrl: string;
}
	export interface IGpsTrackerTypeDtoApi
	{
		 gpsTrackerTypeDtos: IGpsTrackerTypeDto[];
		 totalCount: number;
	}
	export interface IWorkItemComment {
		workItemCommentId: number;
		workItem: IWorkItem;
		comment: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;

}

	export class WorkItemComment implements IWorkItemComment{
		workItemCommentId: number;
		workItem: IWorkItem;
		comment: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;
}
	export interface IWorkItemCommentApi
	{
		 workItemComments: IWorkItemComment[];
		 totalCount: number;
	}
	export interface IWorkItemCommentDto {
		workItemCommentId: number;
		workItemId: number;
		comment: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;

}

	export class WorkItemCommentDto implements IWorkItemCommentDto{
		workItemCommentId: number;
		workItemId: number;
		comment: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;
}
	export interface IWorkItemCommentDtoApi
	{
		 workItemCommentDtos: IWorkItemCommentDto[];
		 totalCount: number;
	}
	export interface IImageBaseStatus {
		imageBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class ImageBaseStatus implements IImageBaseStatus{
		imageBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IImageBaseStatusApi
	{
		 imageBaseStatuss: IImageBaseStatus[];
		 totalCount: number;
	}
	export interface IImageBaseStatusDto {
		imageBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class ImageBaseStatusDto implements IImageBaseStatusDto{
		imageBaseStatusId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IImageBaseStatusDtoApi
	{
		 imageBaseStatusDtos: IImageBaseStatusDto[];
		 totalCount: number;
	}
	export interface IImage {
		imageId: number;
		imageType: IImageType;
		otherIdentifier: number;
		name: string;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		description: string;
		imageStatus: IImageStatus;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class Image implements IImage{
		imageId: number;
		imageType: IImageType;
		otherIdentifier: number;
		name: string;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		description: string;
		imageStatus: IImageStatus;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IImageApi
	{
		 images: IImage[];
		 totalCount: number;
	}
	export interface IImageDto {
		imageId: number;
		imageTypeId: number;
		otherIdentifier: number;
		name: string;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		description: string;
		imageStatusId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class ImageDto implements IImageDto{
		imageId: number;
		imageTypeId: number;
		otherIdentifier: number;
		name: string;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		description: string;
		imageStatusId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IImageDtoApi
	{
		 imageDtos: IImageDto[];
		 totalCount: number;
	}
	export interface IImageStatus {
		imageStatusId: number;
		name: string;
		imageBaseStatus: IImageBaseStatus;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class ImageStatus implements IImageStatus{
		imageStatusId: number;
		name: string;
		imageBaseStatus: IImageBaseStatus;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IImageStatusApi
	{
		 imageStatuss: IImageStatus[];
		 totalCount: number;
	}
	export interface IImageStatusDto {
		imageStatusId: number;
		name: string;
		imageBaseStatusId: number;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class ImageStatusDto implements IImageStatusDto{
		imageStatusId: number;
		name: string;
		imageBaseStatusId: number;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IImageStatusDtoApi
	{
		 imageStatusDtos: IImageStatusDto[];
		 totalCount: number;
	}
	export interface IImageType {
		imageTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class ImageType implements IImageType{
		imageTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IImageTypeApi
	{
		 imageTypes: IImageType[];
		 totalCount: number;
	}
	export interface IImageTypeDto {
		imageTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class ImageTypeDto implements IImageTypeDto{
		imageTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IImageTypeDtoApi
	{
		 imageTypeDtos: IImageTypeDto[];
		 totalCount: number;
	}
	export interface IInvitation {
		invitationId: number;
		name: string;
		email: string;
		invitedFromIp: string;
		invitationAccepted: boolean;
		invitedAt: Date;
		acceptedAt: Date;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class Invitation implements IInvitation{
		invitationId: number;
		name: string;
		email: string;
		invitedFromIp: string;
		invitationAccepted: boolean;
		invitedAt: Date;
		acceptedAt: Date;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IInvitationApi
	{
		 invitations: IInvitation[];
		 totalCount: number;
	}
	export interface IInvitationDto {
		invitationId: number;
		name: string;
		email: string;
		invitedFromIp: string;
		invitationAccepted: boolean;
		invitedAt: Date;
		acceptedAt: Date;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class InvitationDto implements IInvitationDto{
		invitationId: number;
		name: string;
		email: string;
		invitedFromIp: string;
		invitationAccepted: boolean;
		invitedAt: Date;
		acceptedAt: Date;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IInvitationDtoApi
	{
		 invitationDtos: IInvitationDto[];
		 totalCount: number;
	}
	export interface IMobileSetting {
		mobileSettingId: number;
		name: string;
		aPN: string;
		username: string;
		password: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class MobileSetting implements IMobileSetting{
		mobileSettingId: number;
		name: string;
		aPN: string;
		username: string;
		password: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IMobileSettingApi
	{
		 mobileSettings: IMobileSetting[];
		 totalCount: number;
	}
	export interface IMobileSettingDto {
		mobileSettingId: number;
		name: string;
		aPN: string;
		username: string;
		password: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class MobileSettingDto implements IMobileSettingDto{
		mobileSettingId: number;
		name: string;
		aPN: string;
		username: string;
		password: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IMobileSettingDtoApi
	{
		 mobileSettingDtos: IMobileSettingDto[];
		 totalCount: number;
	}
	export interface IWorkItemType {
		workItemTypeId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class WorkItemType implements IWorkItemType{
		workItemTypeId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IWorkItemTypeApi
	{
		 workItemTypes: IWorkItemType[];
		 totalCount: number;
	}
	export interface IWorkItemTypeDto {
		workItemTypeId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class WorkItemTypeDto implements IWorkItemTypeDto{
		workItemTypeId: number;
		name: string;
		sortOrder: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IWorkItemTypeDtoApi
	{
		 workItemTypeDtos: IWorkItemTypeDto[];
		 totalCount: number;
	}
	export interface INetworkOperator {
		networkOperatorId: number;
		country: ICountry;
		name: string;
		email: string;
		phone: string;
		contact: string;
		address: IAddress;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		apn: string;
		apnUser: string;
		apnUserPassword: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;

}

	export class NetworkOperator implements INetworkOperator{
		networkOperatorId: number;
		country: ICountry;
		name: string;
		email: string;
		phone: string;
		contact: string;
		address: IAddress;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		apn: string;
		apnUser: string;
		apnUserPassword: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		image: IImage;
}
	export interface INetworkOperatorApi
	{
		 networkOperators: INetworkOperator[];
		 totalCount: number;
	}
	export interface INetworkOperatorDto {
		networkOperatorId: number;
		countryId: number;
		name: string;
		email: string;
		phone: string;
		contact: string;
		addressId: number;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		apn: string;
		apnUser: string;
		apnUserPassword: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;

}

	export class NetworkOperatorDto implements INetworkOperatorDto{
		networkOperatorId: number;
		countryId: number;
		name: string;
		email: string;
		phone: string;
		contact: string;
		addressId: number;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		apn: string;
		apnUser: string;
		apnUserPassword: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		imageId: number;
}
	export interface INetworkOperatorDtoApi
	{
		 networkOperatorDtos: INetworkOperatorDto[];
		 totalCount: number;
	}
	export interface IUser {
		userId: number;
		name: string;
		login: string;
		userType: IUserType;
		imageUrl: string;
		address: IAddress;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		userTitle: string;
		image: IImage;
		tenantSite: ITenantSite;

}

	export class User implements IUser{
		userId: number;
		name: string;
		login: string;
		userType: IUserType;
		imageUrl: string;
		address: IAddress;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		userTitle: string;
		image: IImage;
		tenantSite: ITenantSite;
}
	export interface IUserApi
	{
		 users: IUser[];
		 totalCount: number;
	}
	export interface IUserDto {
		userId: number;
		name: string;
		login: string;
		userTypeId: number;
		imageUrl: string;
		addressId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		userTitle: string;
		imageId: number;
		tenantSiteId: number;

}

	export class UserDto implements IUserDto{
		userId: number;
		name: string;
		login: string;
		userTypeId: number;
		imageUrl: string;
		addressId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		userTitle: string;
		imageId: number;
		tenantSiteId: number;
}
	export interface IUserDtoApi
	{
		 userDtos: IUserDto[];
		 totalCount: number;
	}
	export interface IResource {
		resourceId: number;
		name: string;
		availableFrom: string;
		availableTo: string;
		assignedToUser: IUser;
		address: IAddress;
		description: string;
		resourceType: IResourceType;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		image: IImage;

}

	export class Resource implements IResource{
		resourceId: number;
		name: string;
		availableFrom: string;
		availableTo: string;
		assignedToUser: IUser;
		address: IAddress;
		description: string;
		resourceType: IResourceType;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		image: IImage;
}
	export interface IResourceApi
	{
		 resources: IResource[];
		 totalCount: number;
	}
	export interface IResourceDto {
		resourceId: number;
		name: string;
		availableFrom: string;
		availableTo: string;
		assignedToUserId: number;
		addressId: number;
		description: string;
		resourceTypeId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		imageId: number;

}

	export class ResourceDto implements IResourceDto{
		resourceId: number;
		name: string;
		availableFrom: string;
		availableTo: string;
		assignedToUserId: number;
		addressId: number;
		description: string;
		resourceTypeId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		imageId: number;
}
	export interface IResourceDtoApi
	{
		 resourceDtos: IResourceDto[];
		 totalCount: number;
	}
	export interface IResourceGroup {
		resourceGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class ResourceGroup implements IResourceGroup{
		resourceGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IResourceGroupApi
	{
		 resourceGroups: IResourceGroup[];
		 totalCount: number;
	}
	export interface IResourceGroupDto {
		resourceGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class ResourceGroupDto implements IResourceGroupDto{
		resourceGroupId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IResourceGroupDtoApi
	{
		 resourceGroupDtos: IResourceGroupDto[];
		 totalCount: number;
	}
	export interface IGpsTracker {
		gpsTrackerId: number;
		name: string;
		trackerIdentification: string;
		imeNumber: string;
		assignedToUser: IUser;
		address: IAddress;
		description: string;
		gpsTrackerType: IGpsTrackerType;
		mobileSetting: IMobileSetting;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		image: IImage;
		trackerPassword: string;
		simCard: ISimCard;

}

	export class GpsTracker implements IGpsTracker{
		gpsTrackerId: number;
		name: string;
		trackerIdentification: string;
		imeNumber: string;
		assignedToUser: IUser;
		address: IAddress;
		description: string;
		gpsTrackerType: IGpsTrackerType;
		mobileSetting: IMobileSetting;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		image: IImage;
		trackerPassword: string;
		simCard: ISimCard;
}
	export interface IGpsTrackerApi
	{
		 gpsTrackers: IGpsTracker[];
		 totalCount: number;
	}
	export interface IGpsTrackerDto {
		gpsTrackerId: number;
		name: string;
		trackerIdentification: string;
		imeNumber: string;
		assignedToUserId: number;
		addressId: number;
		description: string;
		gpsTrackerTypeId: number;
		mobileSettingId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		imageId: number;
		trackerPassword: string;
		simCardId: number;

}

	export class GpsTrackerDto implements IGpsTrackerDto{
		gpsTrackerId: number;
		name: string;
		trackerIdentification: string;
		imeNumber: string;
		assignedToUserId: number;
		addressId: number;
		description: string;
		gpsTrackerTypeId: number;
		mobileSettingId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		imageId: number;
		trackerPassword: string;
		simCardId: number;
}
	export interface IGpsTrackerDtoApi
	{
		 gpsTrackerDtos: IGpsTrackerDto[];
		 totalCount: number;
	}
	export interface IResourceType {
		resourceTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class ResourceType implements IResourceType{
		resourceTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IResourceTypeApi
	{
		 resourceTypes: IResourceType[];
		 totalCount: number;
	}
	export interface IResourceTypeDto {
		resourceTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class ResourceTypeDto implements IResourceTypeDto{
		resourceTypeId: number;
		name: string;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IResourceTypeDtoApi
	{
		 resourceTypeDtos: IResourceTypeDto[];
		 totalCount: number;
	}
	export interface IVehicle {
		vehicleId: number;
		name: string;
		resource: IResource;
		userId: number;
		address: IAddress;
		description: string;
		vehicleType: IVehicleType;
		registrationNo: string;
		vinNum: string;
		make: string;
		model: string;
		vehicleYear: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		hasOBD: boolean;
		gpsTracker: IGpsTracker;
		image: IImage;
		stats: string;
		mapSettings: string;
		adjustStartAddressToHome: boolean;
		adjustStartWithInDistance: number;
		adjustEndAddressToHome: boolean;
		adjustEndWithInDistance: number;
		tenantSite: ITenantSite;

}

	export class Vehicle implements IVehicle{
		vehicleId: number;
		name: string;
		resource: IResource;
		userId: number;
		address: IAddress;
		description: string;
		vehicleType: IVehicleType;
		registrationNo: string;
		vinNum: string;
		make: string;
		model: string;
		vehicleYear: number;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		hasOBD: boolean;
		gpsTracker: IGpsTracker;
		image: IImage;
		stats: string;
		mapSettings: string;
		adjustStartAddressToHome: boolean;
		adjustStartWithInDistance: number;
		adjustEndAddressToHome: boolean;
		adjustEndWithInDistance: number;
		tenantSite: ITenantSite;
}
	export interface IVehicleApi
	{
		 vehicles: IVehicle[];
		 totalCount: number;
	}
	export interface IVehicleDto {
		vehicleId: number;
		name: string;
		resourceId: number;
		userId: number;
		addressId: number;
		description: string;
		vehicleTypeId: number;
		registrationNo: string;
		vinNum: string;
		make: string;
		model: string;
		vehicleYear: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		hasOBD: boolean;
		gpsTrackerId: number;
		imageId: number;
		stats: string;
		mapSettings: string;
		adjustStartAddressToHome: boolean;
		adjustStartWithInDistance: number;
		adjustEndAddressToHome: boolean;
		adjustEndWithInDistance: number;
		tenantSiteId: number;

}

	export class VehicleDto implements IVehicleDto{
		vehicleId: number;
		name: string;
		resourceId: number;
		userId: number;
		addressId: number;
		description: string;
		vehicleTypeId: number;
		registrationNo: string;
		vinNum: string;
		make: string;
		model: string;
		vehicleYear: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		hasOBD: boolean;
		gpsTrackerId: number;
		imageId: number;
		stats: string;
		mapSettings: string;
		adjustStartAddressToHome: boolean;
		adjustStartWithInDistance: number;
		adjustEndAddressToHome: boolean;
		adjustEndWithInDistance: number;
		tenantSiteId: number;
}
	export interface IVehicleDtoApi
	{
		 vehicleDtos: IVehicleDto[];
		 totalCount: number;
	}
	export interface IRetailer {
		retailerId: number;
		name: string;
		retailerType: IRetailerType;
		userId: number;
		imageUrl: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		address: IAddress;
		adminUser: IUser;
		webUrl: string;
		image: IImage;

}

	export class Retailer implements IRetailer{
		retailerId: number;
		name: string;
		retailerType: IRetailerType;
		userId: number;
		imageUrl: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		address: IAddress;
		adminUser: IUser;
		webUrl: string;
		image: IImage;
}
	export interface IRetailerApi
	{
		 retailers: IRetailer[];
		 totalCount: number;
	}
	export interface IRetailerDto {
		retailerId: number;
		name: string;
		retailerTypeId: number;
		userId: number;
		imageUrl: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		addressId: number;
		adminUserId: number;
		webUrl: string;
		imageId: number;

}

	export class RetailerDto implements IRetailerDto{
		retailerId: number;
		name: string;
		retailerTypeId: number;
		userId: number;
		imageUrl: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		addressId: number;
		adminUserId: number;
		webUrl: string;
		imageId: number;
}
	export interface IRetailerDtoApi
	{
		 retailerDtos: IRetailerDto[];
		 totalCount: number;
	}
	export interface IRetailerType {
		retailerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;

}

	export class RetailerType implements IRetailerType{
		retailerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
}
	export interface IRetailerTypeApi
	{
		 retailerTypes: IRetailerType[];
		 totalCount: number;
	}
	export interface IRetailerTypeDto {
		retailerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;

}

	export class RetailerTypeDto implements IRetailerTypeDto{
		retailerTypeId: number;
		name: string;
		order: number;
		description: string;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
}
	export interface IRetailerTypeDtoApi
	{
		 retailerTypeDtos: IRetailerTypeDto[];
		 totalCount: number;
	}
	export interface ISimCard {
		simCardId: number;
		name: string;
		iCCID: string;
		iMSI: string;
		mobileNumber: string;
		pUK: string;
		description: string;
		networkOperator: INetworkOperator;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		image: IImage;

}

	export class SimCard implements ISimCard{
		simCardId: number;
		name: string;
		iCCID: string;
		iMSI: string;
		mobileNumber: string;
		pUK: string;
		description: string;
		networkOperator: INetworkOperator;
		created: Date;
		createdByUser: IUser;
		modifiedByUser: IUser;
		modified: Date;
		isActive: boolean;
		image: IImage;
}
	export interface ISimCardApi
	{
		 simCards: ISimCard[];
		 totalCount: number;
	}
	export interface ISimCardDto {
		simCardId: number;
		name: string;
		iCCID: string;
		iMSI: string;
		mobileNumber: string;
		pUK: string;
		description: string;
		networkOperatorId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		imageId: number;

}

	export class SimCardDto implements ISimCardDto{
		simCardId: number;
		name: string;
		iCCID: string;
		iMSI: string;
		mobileNumber: string;
		pUK: string;
		description: string;
		networkOperatorId: number;
		created: Date;
		createdByUserId: number;
		modifiedByUserId: number;
		modified: Date;
		isActive: boolean;
		imageId: number;
}
	export interface ISimCardDtoApi
	{
		 simCardDtos: ISimCardDto[];
		 totalCount: number;
	}
	export interface IVehicleTripLogFull {
		vehicleTripLogFullId: number;
		started: Date;
		ended: Date;
		distance: number;
		odometerStart: number;
		odometerEnd: number;
		vehicleTripType: IVehicleTripType;
		title: string;
		addressIdStart: number;
		addressIdEnd: number;
		modified: Date;
		fuelConsumption: number;
		duration: number;
		startAddressName: string;
		endAddressName: string;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		estimatedDistance: number;
		estimatedTime: number;

}

	export class VehicleTripLogFull implements IVehicleTripLogFull{
		vehicleTripLogFullId: number;
		started: Date;
		ended: Date;
		distance: number;
		odometerStart: number;
		odometerEnd: number;
		vehicleTripType: IVehicleTripType;
		title: string;
		addressIdStart: number;
		addressIdEnd: number;
		modified: Date;
		fuelConsumption: number;
		duration: number;
		startAddressName: string;
		endAddressName: string;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		estimatedDistance: number;
		estimatedTime: number;
}
	export interface IVehicleTripLogFullApi
	{
		 vehicleTripLogFulls: IVehicleTripLogFull[];
		 totalCount: number;
	}
	export interface IVehicleTripLogFullDto {
		vehicleTripLogFullId: number;
		started: Date;
		ended: Date;
		distance: number;
		odometerStart: number;
		odometerEnd: number;
		vehicleTripTypeId: number;
		description: string;
		addressIdStart: number;
		addressIdEnd: number;
		addressStart: Address;
		addressEnd: Address;
		modified: Date;
		fuelConsumption: number;
		durationInMinutes: number;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		correctedRoute: string;
		estimatedDistance: number;
		estimatedTime: number;
    purposeOfTrip: string
}

	export class VehicleTripLogFullDto implements IVehicleTripLogFullDto{
		vehicleTripLogFullId: number;
		started: Date;
		ended: Date;
		distance: number;
		odometerStart: number;
		odometerEnd: number;
		vehicleTripTypeId: number;
       description: string;
		addressIdStart: number;
		addressIdEnd: number;
		addressStart: Address;
		addressEnd: Address;
		modified: Date;
		fuelConsumption: number;
		durationInMinutes: number;
		latestAccOnTime: Date;
		suggestedRoute: string;
		actualRoute: string;
		correctedRoute: string;
		estimatedDistance: number;
		estimatedTime: number;
    purposeOfTrip: string
}
	export interface IVehicleTripLogFullDtoApi
	{
		 vehicleTripLogFullDtos: IVehicleTripLogFullDto[];
		 totalCount: number;
	}
	export interface ICustomer2 {
		customer2Id: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		phone: string;
		email: string;
		contact: string;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		modified: Date;
}

	export class Customer2 implements ICustomer2{
		customer2Id: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		phone: string;
		email: string;
		contact: string;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		modified: Date;
}
	export interface ICustomer2Api
	{
		 customer2s: ICustomer2[];
		 totalCount: number;
	}
	export interface ICustomer2Dto {
		customer2Id: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		phone: string;
		email: string;
		contact: string;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		modified: Date;
}

	export class Customer2Dto implements ICustomer2Dto{
		customer2Id: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		phone: string;
		email: string;
		contact: string;
		webUrl: string;
		imageUrl: string;
		vatNo: string;
		companyNo: string;
		parentCustomer: number;
		created: Date;
		modified: Date;
}
	export interface ICustomer2DtoApi
	{
		 customer2Dtos: ICustomer2Dto[];
		 totalCount: number;
	}
	export interface ICustomerWithAssignedWorkItem {
		customerWithAssignedWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUser: IUser;
		created: Date;
		createdByUser: IUser;
		priority: string;
		status: string;
		workItemIdentity: number;
		workItemBaseStatus: IWorkItemBaseStatus;
}

	export class CustomerWithAssignedWorkItem implements ICustomerWithAssignedWorkItem{
		customerWithAssignedWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUser: IUser;
		created: Date;
		createdByUser: IUser;
		priority: string;
		status: string;
		workItemIdentity: number;
		workItemBaseStatus: IWorkItemBaseStatus;
}
	export interface ICustomerWithAssignedWorkItemApi
	{
		 customerWithAssignedWorkItems: ICustomerWithAssignedWorkItem[];
		 totalCount: number;
	}
	export interface ICustomerWithAssignedWorkItemDto {
		customerWithAssignedWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserId: number;
		created: Date;
		createdByUserId: number;
		priority: string;
		status: string;
		workItemIdentity: number;
		workItemBaseStatusId: number;
}

	export class CustomerWithAssignedWorkItemDto implements ICustomerWithAssignedWorkItemDto{
		customerWithAssignedWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserId: number;
		created: Date;
		createdByUserId: number;
		priority: string;
		status: string;
		workItemIdentity: number;
		workItemBaseStatusId: number;
}
	export interface ICustomerWithAssignedWorkItemDtoApi
	{
		 customerWithAssignedWorkItemDtos: ICustomerWithAssignedWorkItemDto[];
		 totalCount: number;
	}
	export interface ICustomerWithWorkItem {
		customerWithWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUser: IUser;
		created: Date;
		createdByUser: IUser;
		priority: string;
		workItemIdentity: number;
		status: string;
		assignedToUser: IUser;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		workItemBaseStatus: IWorkItemBaseStatus;
		waterMark: number;
		imageUrl: string;

}

	export class CustomerWithWorkItem implements ICustomerWithWorkItem{
		customerWithWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUser: IUser;
		created: Date;
		createdByUser: IUser;
		priority: string;
		workItemIdentity: number;
		status: string;
		assignedToUser: IUser;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		workItemBaseStatus: IWorkItemBaseStatus;
		waterMark: number;
		imageUrl: string;
}
	export interface ICustomerWithWorkItemApi
	{
		 customerWithWorkItems: ICustomerWithWorkItem[];
		 totalCount: number;
	}
	export interface ICustomerWithWorkItemDto {
		customerWithWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserId: number;
		created: Date;
		createdByUserId: number;
		priority: string;
		workItemIdentity: number;
		status: string;
		assignedToUserId: number;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		workItemBaseStatusId: number;
		waterMark: number;
		imageUrl: string;

}

	export class CustomerWithWorkItemDto implements ICustomerWithWorkItemDto{
		customerWithWorkItemId: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserId: number;
		created: Date;
		createdByUserId: number;
		priority: string;
		workItemIdentity: number;
		status: string;
		assignedToUserId: number;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		workItemBaseStatusId: number;
		waterMark: number;
		imageUrl: string;
}
	export interface ICustomerWithWorkItemDtoApi
	{
		 customerWithWorkItemDtos: ICustomerWithWorkItemDto[];
		 totalCount: number;
	}
	export interface ICustomerWithWorkItem3 {
		customerWithWorkItem3Id: number;
		customerWithWorkItemNo: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserNo: number;
		created: Date;
		createdByUserNo: number;
		priority: string;
		status: string;
		assignedToUserNo: number;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		waterMark: number;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		comment: string;
		workItemStatus: string;
		workItemBaseStatusNo: number;

}

	export class CustomerWithWorkItem3 implements ICustomerWithWorkItem3{
		customerWithWorkItem3Id: number;
		customerWithWorkItemNo: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserNo: number;
		created: Date;
		createdByUserNo: number;
		priority: string;
		status: string;
		assignedToUserNo: number;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		waterMark: number;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		comment: string;
		workItemStatus: string;
		workItemBaseStatusNo: number;
}
	export interface ICustomerWithWorkItem3Api
	{
		 customerWithWorkItem3s: ICustomerWithWorkItem3[];
		 totalCount: number;
	}
	export interface ICustomerWithWorkItem3Dto {
		customerWithWorkItem3Id: number;
		customerWithWorkItemNo: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserNo: number;
		created: Date;
		createdByUserNo: number;
		priority: string;
		status: string;
		assignedToUserNo: number;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		waterMark: number;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		comment: string;
		workItemStatus: string;
		workItemBaseStatusNo: number;

}

	export class CustomerWithWorkItem3Dto implements ICustomerWithWorkItem3Dto{
		customerWithWorkItem3Id: number;
		customerWithWorkItemNo: number;
		name: string;
		longitude: number;
		latitude: number;
		normalizedAddress: string;
		workItemTitle: string;
		description: string;
		modified: Date;
		modifiedByUserNo: number;
		created: Date;
		createdByUserNo: number;
		priority: string;
		status: string;
		assignedToUserNo: number;
		phone: string;
		email: string;
		contact: string;
		estimatedStart: Date;
		isPlanned: boolean;
		waterMark: number;
		imageUrl: string;
		largeThumbUrl: string;
		smallThumbUrl: string;
		comment: string;
		workItemStatus: string;
		workItemBaseStatusNo: number;
}
	export interface ICustomerWithWorkItem3DtoApi
	{
		 customerWithWorkItem3Dtos: ICustomerWithWorkItem3Dto[];
		 totalCount: number;
	}
	export interface IWorkItemView {
		workItemViewId: number;
		name: string;
		workItemTitle: string;
		description: string;
		estimatedWork: string;
		workDone: string;
		estimatedStart: Date;
		created: Date;
		modified: Date;
		customerName: string;
		status: string;
		priority: string;
		type: string;
		address1: string;
		address2: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		sortOrder: number;
		assignedTo: string;

}

	export class WorkItemView implements IWorkItemView{
		workItemViewId: number;
		name: string;
		workItemTitle: string;
		description: string;
		estimatedWork: string;
		workDone: string;
		estimatedStart: Date;
		created: Date;
		modified: Date;
		customerName: string;
		status: string;
		priority: string;
		type: string;
		address1: string;
		address2: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		sortOrder: number;
		assignedTo: string;
}
	export interface IWorkItemViewApi
	{
		 workItemViews: IWorkItemView[];
		 totalCount: number;
	}
	export interface IWorkItemViewDto {
		workItemViewId: number;
		name: string;
		workItemTitle: string;
		description: string;
		estimatedWork: string;
		workDone: string;
		estimatedStart: Date;
		created: Date;
		modified: Date;
		customerName: string;
		status: string;
		priority: string;
		type: string;
		address1: string;
		address2: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		sortOrder: number;
		assignedTo: string;

}

	export class WorkItemViewDto implements IWorkItemViewDto{
		workItemViewId: number;
		name: string;
		workItemTitle: string;
		description: string;
		estimatedWork: string;
		workDone: string;
		estimatedStart: Date;
		created: Date;
		modified: Date;
		customerName: string;
		status: string;
		priority: string;
		type: string;
		address1: string;
		address2: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		sortOrder: number;
		assignedTo: string;
}
	export interface IWorkItemViewDtoApi
	{
		 workItemViewDtos: IWorkItemViewDto[];
		 totalCount: number;
	}
//} // End module



