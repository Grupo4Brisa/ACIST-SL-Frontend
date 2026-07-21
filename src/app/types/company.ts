export type CompanyStatus =
  | 'INCOMPLETE'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'INACTIVE';

export interface Company {
  id: number;

  companyName: string;
  corporateName: string;
  cnpjcpf: string;

  email: string;
  phone: string;

  companySize: string;

  stateRegistration?: string;

  website?: string;

  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  establishmentType?: string;
  headquartersType?: string;

  employeesCount?: number;

  foundationDate?: string;
  associationDate?: string;

  eventPresentation?: string;

  status: CompanyStatus;

  createdAt: string;
  updatedAt: string;
}