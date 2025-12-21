import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  // Lista todas as empresas
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  // Busca uma empresa específica
  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  // Cria uma nova empresa
  create(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  // Atualiza uma empresa
  update(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }

  // Deleta uma empresa
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
