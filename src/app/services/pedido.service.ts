import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoDTO } from '../pages/pedido/pedido.component';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'https://localhost:7007/api/pedidos';
  private apiTraduccion = 'https://localhost:7007/api/traducciones';

  constructor(private http: HttpClient) { }

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }

  postPedido(pedido: PedidoDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, pedido, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  putEstPedido(idPedido: number, dto: EstPedidoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idPedido}`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deletePedido(idPedido: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idPedido}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getPedidoPorId(idPedido: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idPedido}`);
  }

  getPedidoPorCliente(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-pedidos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  generarReportePedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes`, { responseType: 'blob' });
  }

  getEstadoPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/estado-pedidos`);
  }

  getDespachos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/despachos`);
  }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/sucursales`);
  }
}

export interface EstPedidoDTO {
  IdEstPedido: number
}