import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { CpfPipe } from '../../pipes/cpf.pipe';
import { CnpjPipe } from '../../pipes/cnpj.pipe';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, CpfPipe, CnpjPipe],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  showViewModal = false;
  selectedEmployee: Employee | null = null;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  itemsPerPageOptions: number[] = [10, 25, 50];
  
  // Search
  searchTerm: string = '';

  // Expose Math for template
  Math = Math;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    console.log('Carregando funcionários...');
    this.employeeService.getAll().subscribe({
      next: (data) => {
        console.log('Funcionários recebidos:', data);
        this.employees = data;
        this.filteredEmployees = data;
        this.updatePagination();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredEmployees = this.employees;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(term) ||
        employee.login.toLowerCase().includes(term) ||
        employee.cpf.includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.address.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  get pages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  newEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      const currentUserId = this.authService.currentUserValue?.id;
      this.employeeService.delete(id, currentUserId).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Erro ao excluir funcionário:', error);
          if (error.status === 403) {
            alert(error.error.message || 'Você não pode deletar a si próprio. Entre em contato com um administrador.');
          } else {
            alert('Erro ao excluir funcionário. Tente novamente.');
          }
        }
      });
    }
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
