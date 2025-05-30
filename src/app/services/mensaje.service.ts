import { Injectable } from '@angular/core';

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
