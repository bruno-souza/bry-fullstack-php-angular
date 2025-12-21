import { Routes } from '@angular/router';
import { CompaniesComponent } from './components/companies/companies';
import { EmployeesComponent } from './components/employees/employees';
import { CustomersComponent } from './components/customers/customers';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompaniesComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'customers', component: CustomersComponent }
];
