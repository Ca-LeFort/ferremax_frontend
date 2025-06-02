import { Component } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { PagoService } from '../../../services/pago.service';

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  constructor(private pedidoService: PedidoService, private pagoService: PagoService) {}

  generarReportePedidos() {
    this.pedidoService.generarReportePedidos().subscribe(blob => {
      this.descargarArchivo(blob, 'reporte_pedidos.pdf');
    });
  }

  generarReportePagos() {
    this.pagoService.generarReportePagos().subscribe(blob => {
      this.descargarArchivo(blob, 'reporte_pagos.pdf');
    });
  }

  private descargarArchivo(blob: Blob, nombreArchivo: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
