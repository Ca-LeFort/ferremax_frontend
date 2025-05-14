import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7007/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: {Email: string; Password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          return throwError(() => new Error(error.error?.mensaje || "Error desconocido"))
        }
        return throwError(() => new Error("Error con la base de datos, vuelve a intentar más tarde"));
      })
    );
  }

}
