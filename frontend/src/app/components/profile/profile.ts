import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { noAccentsValidator } from '../../validators/no-accents.validator';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      login: ['', [Validators.required, noAccentsValidator()]],
      name: ['', [Validators.required, noAccentsValidator()]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.profileForm.patchValue({
        login: currentUser.login,
        name: currentUser.name,
        cpf: currentUser.cpf,
        email: currentUser.email,
        address: currentUser.address
      });
    }
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

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const currentUser = this.authService.currentUserValue;
      if (!currentUser || !currentUser.id) return;

      if (this.selectedFile) {
        const formData = new FormData();
        Object.keys(this.profileForm.value).forEach(key => {
          if (key === 'password' && !this.profileForm.value[key]) {
            return;
          }
          if (this.profileForm.value[key]) {
            formData.append(key, this.profileForm.value[key]);
          }
        });
        formData.append('document', this.selectedFile);
        
        this.employeeService.updateWithDocument(currentUser.id, formData).subscribe({
          next: (employee) => {
            this.updateLocalUser(employee);
            this.successMessage = 'Perfil atualizado com sucesso!';
            this.isLoading = false;
            this.selectedFile = null;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
          }
        });
      } else {
        const employee: any = { ...this.profileForm.value };
        if (!employee.password) {
          delete employee.password;
        }
        
        this.employeeService.update(currentUser.id, employee).subscribe({
          next: (employee) => {
            this.updateLocalUser(employee);
            this.successMessage = 'Perfil atualizado com sucesso!';
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.profileForm);
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
    }
  }

  goBack(): void {
    this.location.back();
  }

  deleteAccount(): void {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser || !currentUser.id) return;

      this.employeeService.delete(currentUser.id).subscribe({
        next: () => {
          alert('Conta excluída com sucesso');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = 'Erro ao excluir conta. Tente novamente.';
        }
      });
    }
  }

  private updateLocalUser(employee: any): void {
    localStorage.setItem('currentUser', JSON.stringify(employee));
    this.authService['currentUserSubject'].next(employee);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Campo obrigatório';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['hasAccents']) return 'Não pode conter acentuação';
    }
    return '';
  }
}
