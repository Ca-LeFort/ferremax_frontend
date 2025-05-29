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

  createEmpleado(empleado: any): Observable<any> {
    return this.http.post(this.apiUrl, empleado);
  }

  updateEmpleado(empleado: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${empleado.id}`, empleado);
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}