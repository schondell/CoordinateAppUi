export interface Country {
  id: number;
  name: string;
  code?: string;
  countryCode?: string;
  created?: Date;
  createdByUserId?: number;
  modified?: Date;
  modifiedByUserId?: number;
}

export interface CountrySearchResponse {
  data: Country[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}