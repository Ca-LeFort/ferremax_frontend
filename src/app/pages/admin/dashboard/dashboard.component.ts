import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  irPedidos() {
    window.location.href = '/admin/pedido';
  }

  irPagos() {
    window.location.href = '/admin/pago';
  }

  irClientes() {
    window.location.href = '/admin/cliente';
  }

  irEmpleados() {
    window.location.href = '/admin/empleado';
  }

  irReportes() {
    window.location.href = '/admin/reportes';
  }
}
