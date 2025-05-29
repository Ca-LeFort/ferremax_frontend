import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {
  empleados: any[] = [];
  selectedEmpleado: any = null;
  nuevoEmpleado: any = { nombre: '', correo: '' };
  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(){
    this.empleadoService.getEmpleados().subscribe((data: any[]) => {
      this.empleados = data;
    })
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

  createEmpleado() {
    this.empleadoService.createEmpleado(this.nuevoEmpleado).subscribe(() => {
      this.ngOnInit();
      this.nuevoEmpleado = { nombre: '', correo: '' };
    });
  }

}
