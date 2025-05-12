import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  
  Token = '';
  Rol = '';
  Mensaje = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login({Email: this.loginForm.value.Email ?? '', Password: this.loginForm.value.Password ?? ''}).subscribe({
      next: (Response) => {
        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          localStorage.setItem('token', Response.token);
          localStorage.setItem('rol', Response.logRol);
          this.Token = localStorage.getItem('token') || '';
          this.Rol = localStorage.getItem('rol') || '';
        });
      },
      error: (error) => {
        Swal.fire({
          title: '¡Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    })
  }
  
}
