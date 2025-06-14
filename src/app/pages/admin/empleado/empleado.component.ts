import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {
  empleados: any[] = [];
  tipoEmpleados: { [key: number]: string } = {};
  selectedEmpleado: any = null;
  nuevoEmpleado: any = { nombre: '', correo: '' };
  
  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(){
    this.empleadoService.getTipoEmpleados().subscribe(estados => {
      // Crear mapa { id: nombre }
      estados.forEach(e => {
        this.tipoEmpleados[e.idTipoEmp] = e.nombre;
      });
    });

    this.empleadoService.getEmpleados().subscribe(data => {
      this.empleados = data;
    });
  }

  irCrearEmpleado() {
    window.location.href = '/admin/empleado/crear';
  }

  obtenerEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
        next: (data) => {
            this.empleados = data;
            console.log('Empleados obtenidos:', this.empleados); // Registro de los datos recibidos.
        },
        error: (err) => {
            console.error('Error al obtener los empleados:', err.error?.detail || err.message);
        },
    });
}

  editEmpleado(empleado: any) {
    this.selectedEmpleado = { ...empleado };
  }

  cancelEdit() {
    this.selectedEmpleado = null;
  }

  updateEmpleado() {
    this.empleadoService.updateEmpleado(this.selectedEmpleado).subscribe(() => {
      this.ngOnInit();
      this.selectedEmpleado = null;
    });
  }

  deleteEmpleado(id: number) {
    this.empleadoService.deleteEmpleado(id).subscribe(() => {
      this.ngOnInit();
    });
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.deleteEmpleado(id);
    }
  }

}
