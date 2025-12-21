import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { noAccentsValidator } from '../../validators/no-accents.validator';
import { CnpjPipe } from '../../pipes/cnpj.pipe';
import { CpfPipe } from '../../pipes/cpf.pipe';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CnpjPipe, CpfPipe, NgxMaskDirective],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  companyForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  showForm = false;
  showViewModal = false;
  selectedCompany: Company | null = null;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, noAccentsValidator()]],
      cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    console.log('Carregando empresas...');
    this.companyService.getAll().subscribe({
      next: (data) => {
        console.log('Empresas recebidas:', data);
        console.log('Tipo de data:', typeof data, Array.isArray(data));
        this.companies = data;
        this.cdr.detectChanges(); // Força detecção de mudanças
        console.log('companies após atribuição:', this.companies);
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const company: Company = this.companyForm.value;

      if (this.isEditing && this.editingId) {
        this.companyService.update(this.editingId, company).subscribe({
          next: () => {
            this.loadCompanies();
            this.resetForm();
          }
        });
      } else {
        this.companyService.create(company).subscribe({
          next: () => {
            this.loadCompanies();
            this.resetForm();
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.companyForm);
    }
  }

  editCompany(company: Company): void {
    this.isEditing = true;
    this.editingId = company.id!;
    this.showForm = true;
    this.companyForm.patchValue({
      name: company.name,
      cnpj: company.cnpj,
      address: company.address
    });
  }

  deleteCompany(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.loadCompanies();
        }
      });
    }
  }

  resetForm(): void {
    this.companyForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.showForm = false;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.companyForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['hasAccents']) return 'Não pode conter acentuação';
    }
    return '';
  }

  viewCompany(company: Company): void {
    this.selectedCompany = company;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedCompany = null;
  }
}
