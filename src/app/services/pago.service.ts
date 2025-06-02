import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'https://localhost:7007/api/pagos';
  private apiTraduccion = 'https://localhost:7007/api/traducciones';

  constructor(private http: HttpClient) {}

  getPagos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }

  getMedioPagos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/medio-pagos`);
  }

  getEstPagos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/estado-pagos`);
  }

  createPagoMercadoPago(dto: MercadoPagoDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  generarReportePagos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes`, { responseType: 'blob' });
  }

  createPagoTransferencia(dto: TransferenciaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/transferencia`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updatePago(pago: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pago.id}`, pago);
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

export interface MercadoPagoDTO {
  PrecioTotal: number,
  IdPedido: number
}

export interface TransferenciaDTO {
  PrecioTotal: number,
  IdPedido: number
}