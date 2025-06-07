import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  rolEmpleado: string | null = '';

  ngOnInit() {
    this.rolEmpleado = localStorage.getItem('rol'); // Rescatar el rol de un empleado en específico
  }
}
