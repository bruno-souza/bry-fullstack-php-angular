import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { EmployeeService } from '../../../services/employee.service';
import { CompanyService } from '../../../services/company.service';
import { Employee } from '../../../models/employee.model';
import { Company } from '../../../models/company.model';
import { noAccentsValidator } from '../../../validators/no-accents.validator';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  selectedFile: File | null = null;
  companies: Company[] = [];
  selectedCompanyIds: number[] = [];

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.employeeForm = this.fb.group({
      login: ['', [Validators.required, noAccentsValidator()]],
      name: ['', [Validators.required, noAccentsValidator()]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingId = parseInt(id);
      this.employeeForm.get('password')?.clearValidators();
      this.employeeForm.get('password')?.updateValueAndValidity();
      this.loadEmployee(this.editingId);
    }
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    });
  }

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          login: employee.login,
          name: employee.name,
          cpf: employee.cpf,
          email: employee.email,
          address: employee.address
        });
        this.selectedCompanyIds = employee.companies?.map(c => c.id!) || [];
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar funcionário';
        console.error('Erro ao carregar funcionário:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 2MB');
        event.target.value = '';
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Apenas arquivos PDF e JPG são permitidos');
        event.target.value = '';
        return;
      }
      
      this.selectedFile = file;
    }
  }

  toggleCompanySelection(companyId: number): void {
    const index = this.selectedCompanyIds.indexOf(companyId);
    if (index > -1) {
      this.selectedCompanyIds.splice(index, 1);
    } else {
      this.selectedCompanyIds.push(companyId);
    }
  }

  isCompanySelected(companyId: number): boolean {
    return this.selectedCompanyIds.includes(companyId);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.isEditing && this.editingId) {
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.employeeForm.value).forEach(key => {
            if (key === 'password' && !this.employeeForm.value[key]) {
              return;
            }
            if (this.employeeForm.value[key]) {
              formData.append(key, this.employeeForm.value[key]);
            }
          });
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.employeeService.updateWithDocument(this.editingId, formData).subscribe({
            next: () => {
              this.successMessage = 'Funcionário atualizado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/employees']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao atualizar funcionário. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao atualizar funcionário:', error);
            }
          });
        } else {
          const employee: any = {
            ...this.employeeForm.value,
            company_ids: this.selectedCompanyIds
          };
          if (!employee.password) {
            delete employee.password;
          }
          
          this.employeeService.update(this.editingId, employee).subscribe({
            next: () => {
              this.successMessage = 'Funcionário atualizado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/employees']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao atualizar funcionário. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao atualizar funcionário:', error);
            }
          });
        }
      } else {
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.employeeForm.value).forEach(key => {
            formData.append(key, this.employeeForm.value[key]);
          });
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.employeeService.createWithDocument(formData).subscribe({
            next: () => {
              this.successMessage = 'Funcionário cadastrado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/employees']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao cadastrar funcionário. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao cadastrar funcionário:', error);
            }
          });
        } else {
          const employee: any = {
            ...this.employeeForm.value,
            company_ids: this.selectedCompanyIds
          };
          
          this.employeeService.create(employee).subscribe({
            next: () => {
              this.successMessage = 'Funcionário cadastrado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/employees']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao cadastrar funcionário. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao cadastrar funcionário:', error);
            }
          });
        }
      }
    } else {
      this.markFormGroupTouched(this.employeeForm);
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
    }
  }

  goBack(): void {
    this.location.back();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['hasAccents']) return 'Não pode conter acentuação';
    }
    return '';
  }
}
