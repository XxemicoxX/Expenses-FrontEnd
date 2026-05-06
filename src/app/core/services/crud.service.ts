import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export abstract class CrudService<T, W = T> {
  protected http = inject(HttpClient);
  protected abstract endpoint: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(item: W): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  update(item: W): Observable<T> {
    return this.http.put<T>(this.baseUrl, item);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }
}
