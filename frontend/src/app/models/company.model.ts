import { Employee } from './employee.model';
import { Customer } from './customer.model';

export interface Company {
  id?: number;
  name: string;
  cnpj: string;
  address: string;
  employee_ids?: number[];
  customer_ids?: number[];
  employees?: Employee[];
  customers?: Customer[];
  created_at?: string;
  updated_at?: string;
}
