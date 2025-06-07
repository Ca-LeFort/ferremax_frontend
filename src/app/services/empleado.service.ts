import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'https://localhost:7007/api/empleados';
  private apiTraduccion = 'https://localhost:7007/api/traducciones';

  constructor(private http: HttpClient) {}

  registrarEmpleado(empleado: any) {
    return this.http.post(`${this.apiUrl}`, empleado).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          return throwError(() => new Error(error.error?.mensaje || "Error desconocido"))
        }
        return throwError(() => new Error("Error interno, vuelve a intentar más tarde"));
      })
    );
  }

  getEmpleados(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTipoEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/tipo-empleados`);
  }

  getRegiones() {
    return this.http.get<any[]>(`${this.apiTraduccion}/regiones`);
  }

  getComunasByRegion(idRegion: number): Observable<any []> {
    return this.http.get<any[]>(`${this.apiTraduccion}/comunas/${idRegion}`);
  }

  getGeneros() {
    return this.http.get<any[]>(`${this.apiTraduccion}/generos`);
  }

  getEstCivil() {
    return this.http.get<any[]>(`${this.apiTraduccion}/estado-civil`);
  }

  updateEmpleado(empleado: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${empleado.id}`, empleado);
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
