import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../services/pago.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {
  pagos: any[] = [];
  selectedPago: any = null;
  nuevoPago: any = { clienteNombre: '', fecha: '', total: 0 };
  modalVisible: boolean = false;
  pagoSeleccionado: any = null;
  estadoPagos: { [key: number]: string } = {};

  constructor(private pagoService: PagoService) {}

  ngOnInit() {
    this.pagoService.getEstPagos().subscribe(estados => {
      // Crear mapa { id: nombre }
      estados.forEach(e => {
        this.estadoPagos[e.idEstPago] = e.nombre;
      });
    });

    this.pagoService.getPagos().subscribe({
      next: (data) => { this.pagos = data },
      error: (error) => console.error('Error al obtener pagos', error)
    });
  }

  editPago(pago: any) {
    this.selectedPago = { ...pago };
  }

  verDetallePago(pago: any) {
    this.pagoSeleccionado = pago;
  }

  cancelEdit() {
    this.selectedPago = null;
  }

  updatePago() {
    this.pagoService.updatePago(this.selectedPago).subscribe(() => {
      this.ngOnInit();
      this.selectedPago = null;
    });
  }

  deletePago(id: number) {
    this.pagoService.deletePago(id).subscribe(() => {
      this.ngOnInit();
    });
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      this.deletePago(id);
    }
  }

  abrirModal(pedido: any) {
    this.pagoSeleccionado = pedido;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.pagoSeleccionado = null;
  }
}
