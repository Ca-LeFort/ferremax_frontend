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
    return this.http.get<any[]>(this.apiUrl);
  }

  postPedido(pedido: PedidoDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, pedido, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getDespachos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/despachos`);
  }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTraduccion}/sucursales`);
  }
}