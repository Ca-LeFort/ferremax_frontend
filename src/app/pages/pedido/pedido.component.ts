import { Component } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { AlertService } from '../../services/alert.service';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponentCliente {
  sucursalSeleccionado: string = '';
  idDespachoSeleccionado: number = 0;
  idSucursalSeleccionada: number = 0;
  carrito: any;
  despachos: any[] = [];
  sucursales: any[] = [];
  precioTotal: number = 0;

  pedidoForm = new FormGroup({
    despachoSeleccionado: new FormControl('', Validators.required),
    sucursalSeleccionado: new FormControl('')
  });

  constructor(private pedidoService: PedidoService, private carritoService: CarritoService, private alert: AlertService) { }

  ngOnInit() {
    this.obtenerDespachos();
    this.obtenerSucursales();
    const carritoLS = localStorage.getItem('carrito');
    const totalLS = localStorage.getItem('totalCarrito');

    if (carritoLS) {
      this.carrito = JSON.parse(carritoLS);
    }

    if (totalLS) {
      this.precioTotal = parseInt(totalLS);
    }
  }

  obtenerDespachos() {
    this.pedidoService.getDespachos().subscribe({
      next: (data) => this.despachos = data,
      error: (err) => console.error('Error cargando despachos', err)
    });
  }

  obtenerSucursales() {
    this.pedidoService.getSucursales().subscribe({
      next: (data) => this.sucursales = data,
      error: (err) => console.error('Error cargando sucursales', err)
    });
  }

  realizarPedido() {
    const pedido: PedidoDTO = {
      IdDespacho: Number(this.pedidoForm.get('despachoSeleccionado')?.value),
      IdSucursal: Number(this.pedidoForm.get('sucursalSeleccionado')?.value) || null,
      PrecioTotal: this.precioTotal
    };

    this.pedidoService.postPedido(pedido).subscribe({
      next: () => {
        this.alert.success('Éxito', 'Pedido registrado con éxito');
        // redirigir o vaciar carrito
      },
      error: (error: { error: { mensaje: any; }; }) => {
        this.alert.error('Error al registrar el pedido', error.error?.mensaje || '');
        console.log(pedido);
      }
    });

  }
}

export interface PedidoDTO {
  IdDespacho: number;
  IdSucursal: number | null;
  PrecioTotal: number;
}