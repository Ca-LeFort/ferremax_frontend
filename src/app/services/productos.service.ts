import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://localhost:8000/productos';

  constructor(private http: HttpClient) {}

  //* Obtener todos los productos
  getProductos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //* Obtener un producto por su ID
  getProducto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //* Agregar un producto
  addProducto(producto: any, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.post(`${this.apiUrl}/add`, producto, { headers });
  }

  //* Actualizar un producto parcialmente
  updateProducto(id: number, producto: any, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.patch(`${this.apiUrl}/update/${id}`, producto, { headers });
  }

  //* Actualizar completamente un producto
  updateProductoFull(id: number, producto: any, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.put(`${this.apiUrl}/updatefull/${id}`, producto, { headers });
  }

  //* Eliminar un producto
  deleteProducto(id: number, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }
}
