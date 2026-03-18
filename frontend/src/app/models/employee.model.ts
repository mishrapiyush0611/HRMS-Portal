export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface EmployeeCreate {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
}
