import { Company } from './company.model';

export interface Customer {
  id?: number;
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  password?: string;
  document?: File;
  document_path?: string;
  document_url?: string;
  company_ids?: number[];
  companies?: Company[];
  created_at?: string;
  updated_at?: string;
}
