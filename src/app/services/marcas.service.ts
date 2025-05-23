import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = 'https://localhost:8000/marcas';

  constructor(private http: HttpClient) {}

  //* Obtener todas las marcas
  getMarcas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //* Obtener una marca por su ID
  getMarca(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //* Agregar una marca
  addMarca(nombre: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.post(`${this.apiUrl}/add`, { nombre }, { headers });
  }

  //* Actualizar una marca
  updateMarca(id: number, nombre: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.put(`${this.apiUrl}/update/${id}`, { nombre }, { headers });
  }

  //* Eliminar una marca
  deleteMarca(id: number, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': apiKey
    });
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }
}
