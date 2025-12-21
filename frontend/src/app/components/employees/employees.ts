import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { EmployeeService } from '../../services/employee.service';
import { CompanyService } from '../../services/company.service';
import { Employee } from '../../models/employee.model';
import { Company } from '../../models/company.model';
import { noAccentsValidator } from '../../validators/no-accents.validator';
import { CpfPipe } from '../../pipes/cpf.pipe';
import { CnpjPipe } from '../../pipes/cnpj.pipe';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CpfPipe, CnpjPipe, NgxMaskDirective],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  companies: Company[] = [];
  employeeForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  showForm = false;
  selectedFile: File | null = null;
  showViewModal = false;
  selectedEmployee: Employee | null = null;
  selectedCompanyIds: number[] = [];

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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
    this.loadEmployees();
    this.loadCompanies();
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

  loadEmployees(): void {
    console.log('Carregando funcionários...');
    this.employeeService.getAll().subscribe({
      next: (data) => {
        console.log('Funcionários recebidos:', data);
        console.log('Tipo de data:', typeof data, Array.isArray(data));
        this.employees = data;
        this.cdr.detectChanges();
        console.log('employees após atribuição:', this.employees);
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Valida o tamanho do arquivo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 2MB');
        event.target.value = '';
        return;
      }
      
      // Valida o tipo do arquivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Apenas arquivos PDF e JPG são permitidos');
        event.target.value = '';
        return;
      }
      
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      if (this.isEditing && this.editingId) {
        // Na edição, verifica se tem arquivo novo
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.employeeForm.value).forEach(key => {
            // Pula o password se estiver vazio na edição
            if (key === 'password' && !this.employeeForm.value[key]) {
              return;
            }
            if (this.employeeForm.value[key]) {
              formData.append(key, this.employeeForm.value[key]);
            }
          });
          // Adiciona company_ids
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.employeeService.updateWithDocument(this.editingId, formData).subscribe({
            next: () => {
              this.loadEmployees();
              this.resetForm();
            }
          });
        } else {
          // Sem arquivo, faz update normal
          const employee: any = {
            ...this.employeeForm.value,
            company_ids: this.selectedCompanyIds
          };
          // Remove password se estiver vazio
          if (!employee.password) {
            delete employee.password;
          }
          this.employeeService.update(this.editingId, employee).subscribe({
            next: () => {
              this.loadEmployees();
              this.resetForm();
            }
          });
        }
      } else {
        // Criação
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.employeeForm.value).forEach(key => {
            formData.append(key, this.employeeForm.value[key]);
          });
          // Adiciona company_ids
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.employeeService.createWithDocument(formData).subscribe({
            next: () => {
              this.loadEmployees();
              this.resetForm();
            }
          });
        } else {
          const employee: any = {
            ...this.employeeForm.value,
            company_ids: this.selectedCompanyIds
          };
          this.employeeService.create(employee).subscribe({
            next: () => {
              this.loadEmployees();
              this.resetForm();
            }
          });
        }
      }
    } else {
      this.markFormGroupTouched(this.employeeForm);
    }
  }

  editEmployee(employee: Employee): void {
    this.isEditing = true;
    this.editingId = employee.id!;
    this.showForm = true;
    this.employeeForm.patchValue({
      login: employee.login,
      name: employee.name,
      cpf: employee.cpf,
      email: employee.email,
      address: employee.address
    });
    // Preenche as empresas selecionadas
    this.selectedCompanyIds = employee.companies?.map(c => c.id!) || [];
    // Senha não é preenchida por segurança
    this.employeeForm.get('password')?.clearValidators();
    this.employeeForm.get('password')?.updateValueAndValidity();
  }

  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.delete(id).subscribe({
        next: () => {
          this.loadEmployees();
        }
      });
    }
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.showForm = false;
    this.selectedFile = null;
    this.selectedCompanyIds = [];
    this.employeeForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.employeeForm.get('password')?.updateValueAndValidity();
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

  viewEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedEmployee = null;
  }
}
