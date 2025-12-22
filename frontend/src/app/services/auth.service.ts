import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<Employee | null>;
  public currentUser: Observable<Employee | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Employee | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Employee | null {
    return this.currentUserSubject.value;
  }

  login(login: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { login, password })
      .pipe(
        tap(response => {
          if (response.employee) {
            localStorage.setItem('currentUser', JSON.stringify(response.employee));
            this.currentUserSubject.next(response.employee);
          }
        })
      );
  }

  register(employee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, employee)
      .pipe(
        tap(response => {
          if (response.employee) {
            localStorage.setItem('currentUser', JSON.stringify(response.employee));
            this.currentUserSubject.next(response.employee);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
