import { Component, OnInit } from '@angular/core';
import { MensajeService } from '../../../services/mensaje.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensaje',
  imports: [CommonModule],
  templateUrl: './mensaje.component.html'
})
export class MensajeComponent implements OnInit {
  mensajes: any[] = [];

  constructor(private mensajeService: MensajeService) {}

  ngOnInit() {
    this.mensajes = this.mensajeService.getMensajes();
  }
}