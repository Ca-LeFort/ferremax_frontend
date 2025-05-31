import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-admin',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './password-admin.component.html',
  styleUrl: './password-admin.component.css'
})
export class PasswordAdminComponent {
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordMatchValidator });

  rutAdmin = '';

  constructor(private authService: AuthService, private route: ActivatedRoute, 
              private alert: AlertService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.rutAdmin = params['rutAdmin'];
    })
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) return;
    
    const nuevaPassword = this.mapFormPassword();
    this.authService.cambioPasswordAdmin(this.rutAdmin, nuevaPassword).subscribe({
      next: (response) => {
        this.alert.success('Éxito', response.mensaje);
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.alert.error('¡Error!', error.message);
      }
    })
  }

  private mapFormPassword(): any {
    return {
      Password: this.passwordForm.get('password')?.value || ''
    }
  }
}

//* Validación de contraseñas
function passwordMatchValidator(form: AbstractControl) {
  //* Valida que las contraseñas coincidan
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { noCoincide: true }; //* Devuelve error si no coinciden
}
