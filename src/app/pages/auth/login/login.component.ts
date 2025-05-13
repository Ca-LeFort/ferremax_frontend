import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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
        console.log('');
      },
    })
  }
  
}
