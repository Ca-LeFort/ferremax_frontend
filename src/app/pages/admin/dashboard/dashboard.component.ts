import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  rolEmpleado: string | null = '';

  ngOnInit() {
    this.rolEmpleado = localStorage.getItem('rol'); // Rescatar el rol de un empleado en específico
  }

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
