import { Routes } from '@angular/router';
import { CompaniesComponent } from './components/companies/companies';
import { CompanyFormComponent } from './components/companies/company-form/company-form';
import { EmployeesComponent } from './components/employees/employees';
import { EmployeeFormComponent } from './components/employees/employee-form/employee-form';
import { CustomersComponent } from './components/customers/customers';
import { CustomerFormComponent } from './components/customers/customer-form/customer-form';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile/profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { path: 'companies', component: CompaniesComponent, canActivate: [authGuard] },
  { path: 'companies/new', component: CompanyFormComponent, canActivate: [authGuard] },
  { path: 'companies/edit/:id', component: CompanyFormComponent, canActivate: [authGuard] },
  
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard] },
  { path: 'employees/new', component: EmployeeFormComponent, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: EmployeeFormComponent, canActivate: [authGuard] },
  
  { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
  { path: 'customers/new', component: CustomerFormComponent, canActivate: [authGuard] },
  { path: 'customers/edit/:id', component: CustomerFormComponent, canActivate: [authGuard] },
  
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
];
