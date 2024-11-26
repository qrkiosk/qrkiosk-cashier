export interface Employee {
  username: string;
  name: string;
  companyId: number;
  storeId: number;
  employeeId: number;
  isActive: boolean;
  authorities: string[];
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export interface AuthResult {
  user: Employee;
  token: string;
  expiresIn: number;
}
