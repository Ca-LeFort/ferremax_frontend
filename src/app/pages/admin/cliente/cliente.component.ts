import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes: any[] = [];
  selectedCliente: any = null;
  nuevoCliente: any = { nombre: '', correo: '' };

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  irCrearCliente() {
    window.location.href = '/admin/cliente/crear';
  }

  createCliente() {
    this.clienteService.createCliente(this.nuevoCliente).subscribe(() => {
      this.ngOnInit();
      this.nuevoCliente = { nombre: '', correo: '' };
    });
  }

  editCliente(cliente: any) {
    this.selectedCliente = { ...cliente };
  }

  cancelEdit() {
    this.selectedCliente = null;
  }

  updateCliente() {
    this.clienteService.updateCliente(this.selectedCliente).subscribe(() => {
      this.ngOnInit();
      this.selectedCliente = null;
    });
  }

  deleteCliente(id: number) {
    this.clienteService.deleteCliente(id).subscribe(() => {
      this.ngOnInit();
    });
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.deleteCliente(id);
    }
  }

}