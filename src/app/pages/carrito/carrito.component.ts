import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: any = null;
  total: number = 0;
  dolar: number = 0;

  constructor(private http: HttpClient, private carritoService: CarritoService, private alert: AlertService, private router: Router) { }

  getDolar() {
    this.http.get('https://mindicador.cl/api').subscribe({
      next: (data: any) => this.dolar = data.dolar.valor,
      error: (error) => console.error(error)
    })
  }

  ngOnInit(): void {
    this.carritoService.getCarrito().subscribe({
      next: (data) => { this.carrito = data },
      error: (error) => { console.error('Error al obtener el carito: ', error) }
    });
    console.log(this.dolar);
    this.carritoService.setTotal(this.calcularTotalConDescuento());
    localStorage.setItem('carrito', this.carrito);
  }

  calcularTotal(): number {
    return this.carrito.productoCarritos.reduce(
      (acc: number, item: any) =>
        acc + item.cantidad * item.idProductoNavigation.precio,
      0
    );
  }

  cambiarCantidad(item: any, delta: number): void {
    const nuevaCantidad = item.cantidad + delta;

    if (nuevaCantidad < 1 || nuevaCantidad > item.idProductoNavigation.stock) {
      return;
    }

    const dto = {
      IdProducto: item.idProducto,
      nuevaCantidad: nuevaCantidad
    };

    this.carritoService.actualizarProducto(this.carrito.idCarrito, dto).subscribe({
      next: () => {
        item.cantidad = nuevaCantidad;
      },
      error: (err) => {
        console.error('Error al actualizar cantidad', err);
      }
    });
  }

  obtenerCantidadTotal(): number {
    return this.carrito.productoCarritos.reduce(
      (acc: number, item: any) =>
        acc + item.cantidad,
      0);
  }

  calcularTotalConDescuento(): number {
    const total = this.carrito.productoCarritos.reduce(
      (acc: number, item: any) =>
        acc + item.cantidad * item.idProductoNavigation.precio,
      0);

    const cantidadTotal = this.obtenerCantidadTotal();
    const descuento = cantidadTotal >= 4 ? 0.25 : 0; // 25% de descuento si hay 4 o más

    return total - (total * descuento);
  }

  obtenerDescuento(): number {
    const total = this.calcularTotal();
    return this.obtenerCantidadTotal() >= 4 ? total * 0.1 : 0;
  }

  eliminarProductoCarrito(carritoId: number, productoId: number): void {
    this.carritoService.deleteProducto(carritoId, productoId).subscribe({
      next: () => {
        this.carrito.productoCarritos = this.carrito.productoCarritos.filter(
          (item: any) => item.idProducto !== productoId
        );
        this.total = this.calcularTotal();
      }
    })
  }

  procesarPedido() {
    // guardar carrito y total en localStorage para que el componente Pedido los lea
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    localStorage.setItem('totalCarrito', this.calcularTotalConDescuento().toString());

    // Redirigir al componente del pedido
    this.router.navigate(['/pedido']);
  }
}
