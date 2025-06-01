import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MercadoPagoDTO, PagoService, TransferenciaDTO } from '../../services/pago.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponentCliente {
  monto: number = Number(localStorage.getItem('monto'));
  pedidoId: number = Number(localStorage.getItem('pedidoId'));
  medioPagos: any[] = [];

  pagoForm = new FormGroup({
    medioPagoSeleccionado: new FormControl('', Validators.required)
  });

  constructor(private pagoService: PagoService, private router: Router) { }

  ngOnInit() {
    this.obtenerMedioPagos();
  }

  obtenerMedioPagos() {
    this.pagoService.getMedioPagos().subscribe({
      next: (data) => this.medioPagos = data,
      error: (err) => console.error('Error cargando Medios de Pagos', err)
    });
  }

  procesarPagoTarjeta() {
    const pagoTarjeta: MercadoPagoDTO = {
      PrecioTotal: this.monto,
      IdPedido: this.pedidoId
    }

    this.pagoService.createPagoMercadoPago(pagoTarjeta).subscribe({
      next: (res) => {
        window.location.href = res.init_point; // Se redirige a Mercado Pago
      },
      error: (error) => {
        console.error("Error al iniciar pago con tarjeta", error);
      }
    });
  }

  procesarPagoTransferencia() {
    const confirmacion = confirm("¿Confirmas que harás la transferencia a la cuenta indicada?");

    if (!confirmacion) {
      return;
    }

    const pagoTransferencia: TransferenciaDTO = {
      PrecioTotal: this.monto,
      IdPedido: this.pedidoId
    };

    this.pagoService.createPagoTransferencia(pagoTransferencia).subscribe({
      next: (res: any) => {
        alert('Pago por transferencia registrado. En espera de confirmación.');
        this.router.navigate(['/comprobante/pendiente']);
      },
      error: err => {
        console.error('Error al registrar transferencia', err);
        alert('Ocurrió un error al registrar el pago por transferencia.');
      }
    });
  }
}
