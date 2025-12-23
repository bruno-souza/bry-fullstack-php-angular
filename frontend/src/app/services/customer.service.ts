import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  // Lista todos os clientes
  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // Busca um cliente específico
  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // Cria um novo cliente
  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  // Cria um cliente com documento (FormData)
  createWithDocument(formData: FormData): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, formData);
  }

  // Atualiza um cliente
  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  // Atualiza um cliente com documento (FormData)
  updateWithDocument(id: number, formData: FormData): Observable<Customer> {
    formData.append('_method', 'PUT');
    return this.http.post<Customer>(`${this.apiUrl}/${id}`, formData);
  }

  // Deleta um cliente
  delete(id: number, currentUserId?: number): Observable<any> {
    const body = currentUserId ? { current_user_id: currentUserId } : {};
    return this.http.delete(`${this.apiUrl}/${id}`, { body });
  }
}
