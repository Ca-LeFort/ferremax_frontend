import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'https://localhost:7007/pagos'; 

  constructor(private http: HttpClient) {}

  getPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPago(pago: any): Observable<any> {
    return this.http.post(this.apiUrl, pago);
  }

  updatePago(pago: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pago.id}`, pago);
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}