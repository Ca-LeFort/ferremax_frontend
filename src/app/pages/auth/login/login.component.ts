import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert.service'; //* Ahora las alertas son un servicio que se importa facil

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //* Formulario de inicio de sesión
  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  //* Variables para almacenar el token y rol
  Token = '';
  Rol = '';

  constructor(private authService: AuthService, private alert: AlertService) {}

  //* Método para manejar el envío del formulario
  onSubmit() {
    const { Email, Password } = this.loginForm.value;

    this.authService.login({ Email: Email ?? '', Password: Password ?? '' }).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (error) => this.handleLoginError(error)
    });
  }

  //* Manejo del inicio de sesión exitoso
  private handleLoginSuccess(response: any) {
    this.alert.success('¡Bienvenido!', 'Has iniciado sesión correctamente').then(() => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('rol', response.logRol);
      this.Token = localStorage.getItem('token') || '';
      this.Rol = localStorage.getItem('rol') || '';
    });
  }

  //* Manejo de errores en el inicio de sesión
  private handleLoginError(error: any) {
    this.alert.error('¡ERROR!', error.message);
  }
}
