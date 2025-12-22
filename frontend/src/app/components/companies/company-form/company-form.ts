import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { noAccentsValidator } from '../../../validators/no-accents.validator';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './company-form.html',
  styleUrls: ['./company-form.css']
})
export class CompanyFormComponent implements OnInit {
  companyForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, noAccentsValidator()]],
      cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingId = parseInt(id);
      this.loadCompany(this.editingId);
    }
  }

  loadCompany(id: number): void {
    this.companyService.getById(id).subscribe({
      next: (company) => {
        this.companyForm.patchValue({
          name: company.name,
          cnpj: company.cnpj,
          address: company.address
        });
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar empresa';
        console.error('Erro ao carregar empresa:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const company: Company = this.companyForm.value;

      if (this.isEditing && this.editingId) {
        this.companyService.update(this.editingId, company).subscribe({
          next: () => {
            this.successMessage = 'Empresa atualizada com sucesso!';
            this.isLoading = false;
            setTimeout(() => this.router.navigate(['/companies']), 1500);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao atualizar empresa. Tente novamente.';
            this.isLoading = false;
            console.error('Erro ao atualizar empresa:', error);
          }
        });
      } else {
        this.companyService.create(company).subscribe({
          next: () => {
            this.successMessage = 'Empresa cadastrada com sucesso!';
            this.isLoading = false;
            setTimeout(() => this.router.navigate(['/companies']), 1500);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao cadastrar empresa. Tente novamente.';
            this.isLoading = false;
            console.error('Erro ao cadastrar empresa:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.companyForm);
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
}
