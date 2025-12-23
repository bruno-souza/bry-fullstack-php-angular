import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Lista todos os funcionários
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // Busca um funcionário específico
  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Cria um novo funcionário
  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // Cria um funcionário com documento (FormData)
  createWithDocument(formData: FormData): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, formData);
  }

  // Atualiza um funcionário
  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  // Atualiza um funcionário com documento (FormData)
  updateWithDocument(id: number, formData: FormData): Observable<Employee> {
    formData.append('_method', 'PUT');
    return this.http.post<Employee>(`${this.apiUrl}/${id}`, formData);
  }

  // Deleta um funcionário
  delete(id: number, currentUserId?: number): Observable<any> {
    const body = currentUserId ? { current_user_id: currentUserId } : {};
    return this.http.delete(`${this.apiUrl}/${id}`, { body });
  }
}
