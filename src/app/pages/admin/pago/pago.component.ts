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

  constructor(private pagoService: PagoService) {}

  ngOnInit() {
    this.pagoService.getPagos().subscribe(data => {
      this.pagos = data;
    });
  }

  editPago(pago: any) {
    this.selectedPago = { ...pago };
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
}
