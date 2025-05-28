import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';

@Component({
  selector: 'app-empleado',
  imports: [],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {
  empleados: any[] = [];
  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(){
    this.empleadoService.getEmpleados().subscribe((data: any[]) => {
      this.empleados = data;
    })
  }

}
