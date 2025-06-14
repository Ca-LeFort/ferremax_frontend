import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7007/api/auth';

  constructor(private http: HttpClient) { }

  //* Método para iniciar sesión
  login(credentials: { Email: string; Password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error(error.error?.mensaje || "Error desconocido"));
        } else if (error.status === 400) { // En caso de que sea administrador
          const rutAdmin = error.error?.rutAdmin;
          return throwError(() => ({
            tipo: 'CAMBIO_PASSWORD',
            rutAdmin: rutAdmin,
            mensaje: error.error?.mensaje //|| "Se requiere cambiar la contraseña por primera vez"
          }));
        } else if (error.status === 404) {
          return throwError(() => new Error(error.error?.mensaje || "Error desconocido"));
        }
        return throwError(() => new Error("Error con la base de datos, vuelve a intentar más tarde"));
      })
    );
  }

  //* Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false; //* No hay token, no está autenticado
    }

    //* Decodificar el token para verificar su validez
    const decodedToken: any = jwtDecode(token);
    const expirationDate = decodedToken.exp * 1000; //* Convertir a milisegundos

    return expirationDate > Date.now(); //* Verificar si el token no ha expirado
  }

  //* Método para obtener la información del usuario desde el token
  getUser(): any {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token); //* Devuelve la información del usuario decodificada
    }
    return null; //* No hay token, no hay usuario
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');

    localStorage.clear();
  }

  // Método para actualizar la contraseña del administrador
  cambioPasswordAdmin(rut: string, credentials: { Password: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePass/${rut}`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          return throwError(() => new Error(error.error?.mensaje || "Error desconocido"));
        }
        return throwError(() => new Error("Error con la base de datos, vuelve a intentar más tarde"));
      })
    )
  }
}
