import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CustomerService } from '../../services/customer.service';
import { CompanyService } from '../../services/company.service';
import { Customer } from '../../models/customer.model';
import { Company } from '../../models/company.model';
import { noAccentsValidator } from '../../validators/no-accents.validator';
import { CpfPipe } from '../../pipes/cpf.pipe';
import { CnpjPipe } from '../../pipes/cnpj.pipe';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CpfPipe, CnpjPipe, NgxMaskDirective],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  companies: Company[] = [];
  customerForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  showForm = false;
  selectedFile: File | null = null;
  showViewModal = false;
  selectedCustomer: Customer | null = null;
  selectedCompanyIds: number[] = [];

  constructor(
    private customerService: CustomerService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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
    this.loadCustomers();
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

  loadCustomers(): void {
    console.log('Carregando clientes...');
    this.customerService.getAll().subscribe({
      next: (data) => {
        console.log('Clientes recebidos:', data);
        console.log('Tipo de data:', typeof data, Array.isArray(data));
        this.customers = data;
        this.cdr.detectChanges();
        console.log('customers após atribuição:', this.customers);
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
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
    if (this.customerForm.valid) {
      if (this.isEditing && this.editingId) {
        // Na edição, verifica se tem arquivo novo
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.customerForm.value).forEach(key => {
            // Pula o password se estiver vazio na edição
            if (key === 'password' && !this.customerForm.value[key]) {
              return;
            }
            if (this.customerForm.value[key]) {
              formData.append(key, this.customerForm.value[key]);
            }
          });
          // Adiciona company_ids
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.customerService.updateWithDocument(this.editingId, formData).subscribe({
            next: () => {
              this.loadCustomers();
              this.resetForm();
            }
          });
        } else {
          // Sem arquivo, faz update normal
          const customer: any = {
            ...this.customerForm.value,
            company_ids: this.selectedCompanyIds
          };
          // Remove password se estiver vazio
          if (!customer.password) {
            delete customer.password;
          }
          this.customerService.update(this.editingId, customer).subscribe({
            next: () => {
              this.loadCustomers();
              this.resetForm();
            }
          });
        }
      } else {
        // Criação
        if (this.selectedFile) {
          const formData = new FormData();
          Object.keys(this.customerForm.value).forEach(key => {
            formData.append(key, this.customerForm.value[key]);
          });
          // Adiciona company_ids
          this.selectedCompanyIds.forEach(id => {
            formData.append('company_ids[]', id.toString());
          });
          formData.append('document', this.selectedFile);
          
          this.customerService.createWithDocument(formData).subscribe({
            next: () => {
              this.loadCustomers();
              this.resetForm();
            }
          });
        } else {
          const customer: any = {
            ...this.customerForm.value,
            company_ids: this.selectedCompanyIds
          };
          this.customerService.create(customer).subscribe({
            next: () => {
              this.loadCustomers();
              this.resetForm();
            }
          });
        }
      }
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  editCustomer(customer: Customer): void {
    this.isEditing = true;
    this.editingId = customer.id!;
    this.showForm = true;
    this.customerForm.patchValue({
      login: customer.login,
      name: customer.name,
      cpf: customer.cpf,
      email: customer.email,
      address: customer.address
    });
    // Preenche as empresas selecionadas
    this.selectedCompanyIds = customer.companies?.map(c => c.id!) || [];
    // Senha não é preenchida por segurança
    this.customerForm.get('password')?.clearValidators();
    this.customerForm.get('password')?.updateValueAndValidity();
  }

  deleteCustomer(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.customerService.delete(id).subscribe({
        next: () => {
          this.loadCustomers();
        }
      });
    }
  }

  resetForm(): void {
    this.customerForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.showForm = false;
    this.selectedFile = null;
    this.selectedCompanyIds = [];
    this.customerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.customerForm.get('password')?.updateValueAndValidity();
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

  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedCustomer = null;
  }
}
