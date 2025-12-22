import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CnpjPipe } from '../../pipes/cnpj.pipe';
import { CpfPipe } from '../../pipes/cpf.pipe';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, CnpjPipe, CpfPipe],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  paginatedCompanies: Company[] = [];
  showViewModal = false;
  selectedCompany: Company | null = null;
  
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
    private companyService: CompanyService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    console.log('Carregando empresas...');
    this.companyService.getAll().subscribe({
      next: (data) => {
        console.log('Empresas recebidas:', data);
        this.companies = data;
        this.filteredCompanies = data;
        this.updatePagination();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCompanies = this.companies;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCompanies = this.companies.filter(company =>
        company.name.toLowerCase().includes(term) ||
        company.cnpj.includes(term) ||
        company.address.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCompanies.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCompanies = this.filteredCompanies.slice(startIndex, endIndex);
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

  newCompany(): void {
    this.router.navigate(['/companies/new']);
  }

  editCompany(id: number): void {
    this.router.navigate(['/companies/edit', id]);
  }

  deleteCompany(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Erro ao excluir empresa:', error);
          alert('Erro ao excluir empresa. Tente novamente.');
        }
      });
    }
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
