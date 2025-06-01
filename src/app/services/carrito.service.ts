import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = 'https://localhost:7007/api/carrito';

  constructor(private http: HttpClient) { }

  // Cálculo del total para ir al proceso de pedido
  private totalCarrito = new BehaviorSubject<number>(0);
  totalCarrito$ = this.totalCarrito.asObservable();

  setTotal(valor: number) {
    this.totalCarrito.next(valor);
  }

  getTotal(): number {
    return this.totalCarrito.getValue();
  }

  getCarrito(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mi-carrito`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  crearCarrito(): Observable<{ mensaje: string, idCarrito: number }> {
    return this.http.post<{ mensaje: string, idCarrito: number }>(
      `${this.apiUrl}/crear`,
      {}
    );
  }

  agregarProducto(carritoId: number, productoId: number, cantidad: number) {
    const body = {
      IdProducto: productoId,
      cantidad: cantidad
    }

    return this.http.post(`${this.apiUrl}/${carritoId}/agregar-producto`, body);
  }

  obtenerCarritoActivo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carrito-activo`);
  }

  actualizarProducto(carritoId: number, dto: { IdProducto: number, nuevaCantidad: number }): Observable<any> {
    const url = `${this.apiUrl}/${carritoId}/actualizar-producto`;
    return this.http.put(url, dto);
  }

  deleteProducto(carritoId: number, productoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${carritoId}/eliminar-carrito/${productoId}`, {
      headers: {
        Autorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
