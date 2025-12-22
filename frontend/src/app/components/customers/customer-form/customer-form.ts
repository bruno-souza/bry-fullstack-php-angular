import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { CustomerService } from '../../../services/customer.service';
import { CompanyService } from '../../../services/company.service';
import { Customer } from '../../../models/customer.model';
import { Company } from '../../../models/company.model';
import { noAccentsValidator } from '../../../validators/no-accents.validator';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  selectedFile: File | null = null;
  companies: Company[] = [];
  selectedCompanyIds: number[] = [];

  constructor(
    private customerService: CustomerService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.customerForm = this.fb.group({
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
      this.customerForm.get('password')?.clearValidators();
      this.customerForm.get('password')?.updateValueAndValidity();
      this.loadCustomer(this.editingId);
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

  loadCustomer(id: number): void {
    this.customerService.getById(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          login: customer.login,
          name: customer.name,
          cpf: customer.cpf,
          email: customer.email,
          address: customer.address
        });
        this.selectedCompanyIds = customer.companies?.map(c => c.id!) || [];
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar cliente';
        console.error('Erro ao carregar cliente:', error);
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
    if (this.customerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.isEditing && this.editingId) {
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.customerForm.value).forEach(key => {
            if (key === 'password' && !this.customerForm.value[key]) {
              return;
            }
            if (this.customerForm.value[key]) {
              formData.append(key, this.customerForm.value[key]);
            }
          });
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.customerService.updateWithDocument(this.editingId, formData).subscribe({
            next: () => {
              this.successMessage = 'Cliente atualizado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/customers']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao atualizar cliente. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao atualizar cliente:', error);
            }
          });
        } else {
          const customer: any = {
            ...this.customerForm.value,
            company_ids: this.selectedCompanyIds
          };
          if (!customer.password) {
            delete customer.password;
          }
          
          this.customerService.update(this.editingId, customer).subscribe({
            next: () => {
              this.successMessage = 'Cliente atualizado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/customers']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao atualizar cliente. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao atualizar cliente:', error);
            }
          });
        }
      } else {
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.customerForm.value).forEach(key => {
            formData.append(key, this.customerForm.value[key]);
          });
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.customerService.createWithDocument(formData).subscribe({
            next: () => {
              this.successMessage = 'Cliente cadastrado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/customers']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao cadastrar cliente. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao cadastrar cliente:', error);
            }
          });
        } else {
          const customer: any = {
            ...this.customerForm.value,
            company_ids: this.selectedCompanyIds
          };
          
          this.customerService.create(customer).subscribe({
            next: () => {
              this.successMessage = 'Cliente cadastrado com sucesso!';
              this.isLoading = false;
              setTimeout(() => this.router.navigate(['/customers']), 1500);
            },
            error: (error) => {
              this.errorMessage = 'Erro ao cadastrar cliente. Tente novamente.';
              this.isLoading = false;
              console.error('Erro ao cadastrar cliente:', error);
            }
          });
        }
      }
    } else {
      this.markFormGroupTouched(this.customerForm);
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
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
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
