import { Component } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-pedidos',
  imports: [CommonModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent {
  pedidos: any[] = [];

  constructor(private pedidoService: PedidoService) { }

  ngOnInit() {
    this.obtenerPedidosCliente();
  }

  obtenerPedidosCliente() {
    this.pedidoService.getPedidoPorCliente().subscribe({
      next: (data) => { this.pedidos = data },
      error: (error) => console.error('No se pudo obtener pedidos: ', error)
    })
  }

  pedidoSeleccionado: any = null;

  verDetallePedido(id: number) {
    this.pedidoService.getPedidoPorId(id).subscribe({
      next: (data) => {
        this.pedidoSeleccionado = data;
      },
      error: (err) => {
        console.error("Error al obtener el detalle:", err);
      }
    });
  }

  cerrarModal() {
    this.pedidoSeleccionado = null;
  }
}
