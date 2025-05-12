import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'https://localhost:7007/api/clientes';
  private apiTraduccion = 'https://localhost:7007/api/traducciones';

  constructor(private http: HttpClient) { }

  registrarCliente(cliente: any) {
    return this.http.post(`${this.apiUrl}`, cliente).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          return throwError(() => new Error(error.error?.mensaje || "Error desconocido"))
        }
        return throwError(() => new Error("Error interno, vuelve a intentar más tarde"));
      })
    );
  }

  getRegiones() {
    return this.http.get<{ Id: number; Nombre: string }[]>(`${this.apiTraduccion}/regiones`);
  }

  getComunasByRegion(idRegion: number): Observable<any []> {
    return this.http.get<{ Id: number; Nombre: string }[]>(`${this.apiTraduccion}/comunas/${idRegion}`);
  }

  getGeneros() {
    return this.http.get<{ Id: number; Nombre: string }[]>(`${this.apiTraduccion}/generos`);
  }

  getEstCivil() {
    return this.http.get<{ Id: number; Nombre: string }[]>(`${this.apiTraduccion}/estado-civil`);
  }
}
