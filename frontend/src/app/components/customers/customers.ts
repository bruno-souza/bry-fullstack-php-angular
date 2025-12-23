import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { CpfPipe } from '../../pipes/cpf.pipe';
import { CnpjPipe } from '../../pipes/cnpj.pipe';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, CpfPipe, CnpjPipe],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  showViewModal = false;
  selectedCustomer: Customer | null = null;
  
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
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    console.log('Carregando clientes...');
    this.customerService.getAll().subscribe({
      next: (data) => {
        console.log('Clientes recebidos:', data);
        this.customers = data;
        this.filteredCustomers = data;
        this.updatePagination();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCustomers = this.customers;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.login.toLowerCase().includes(term) ||
        customer.cpf.includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.address.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
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

  newCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      const currentUserId = this.authService.currentUserValue?.id;
      this.customerService.delete(id, currentUserId).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          if (error.status === 403) {
            alert(error.error.message || 'Você não pode deletar a si próprio. Entre em contato com um administrador.');
          } else {
            alert('Erro ao excluir cliente. Tente novamente.');
          }
        }
      });
    }
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
