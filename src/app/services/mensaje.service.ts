import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private mensajes: any[] = [];

  addMensaje(mensaje: any) {
    this.mensajes.push(mensaje);
  }

  getMensajes() {
    return this.mensajes;
  }
}