import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'https://localhost:7007/api/empleados'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}