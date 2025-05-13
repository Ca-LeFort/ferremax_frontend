import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{7,8}-[\dkK]$/), this.validarRut()]),
    pnombre: new FormControl('', [Validators.required]),
    snombre: new FormControl('',),
    papellido: new FormControl('', [Validators.required]),
    sapellido: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required,]),
    fechanacimiento: new FormControl('', [Validators.required]),
    genero: new FormControl(0, [Validators.required]),
    estcivil: new FormControl(0, [Validators.required]),
    comuna: new FormControl(0, [Validators.required]),
    notificacion: new FormControl(1),
  }, { validators: passwordMatchValidator });

  regiones: any[] = [];
  comunas: any[] = [];
  generos: any[] = [];
  estCiviles: any[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.clienteService.getRegiones().subscribe(data => this.regiones = data);
    this.clienteService.getGeneros().subscribe(data => this.generos = data);
    this.clienteService.getEstCivil().subscribe(data => this.estCiviles = data);
  }

  registrar() {
    const datosCliente = {
      RutCliente: this.registerForm.get('rut')?.value || '',
      PNombre: this.registerForm.get('pnombre')?.value || '',
      SNombre: this.registerForm.get('snombre')?.value || null,
      PApellido: this.registerForm.get('papellido')?.value || '',
      SApellido: this.registerForm.get('rut')?.value || '',
      Email: this.registerForm.get('email')?.value || '',
      Password: this.registerForm.get('password')?.value || '',
      Telefono: Number(this.registerForm.get('telefono')?.value),
      Direccion: this.registerForm.get('direccion')?.value || '',
      FechaNacimiento: this.registerForm.get('fechanacimiento')?.value || '',
      IdGenero: Number(this.registerForm.get('genero')?.value),
      IdEstCivil: Number(this.registerForm.get('estcivil')?.value),
      IdComuna: Number(this.registerForm.get('comuna')?.value),
      IdNotificacion: Number(this.registerForm.get('notificacion')?.value),
    };
    console.log(datosCliente);
    this.clienteService.registrarCliente(datosCliente).subscribe({
      next: (Response) => {
        console.log('login');
      },
      error: (error) => {
        console.log('error');
      }
    })
  }

  idRegionSelected: number | null = null;

  cargarComunas(event: Event): void {
    const idRegionSelected = event.target as HTMLSelectElement;
    const idRegion = Number(idRegionSelected.value);

    if (!idRegion || isNaN(idRegion)) {
      this.comunas = []; // Limpiar comunas si no hay región válida
      return;
    }

    this.clienteService.getComunasByRegion(idRegion).subscribe(data => {
      this.comunas = data;
    });
  }

  estadoNotificacion(event: Event) {
    const marcado = event.target as HTMLInputElement;
    this.registerForm.patchValue({ notificacion: marcado.checked ? 2 : 1 });
  }

  validarRut(): ValidatorFn {
    return (control: AbstractControl) => {
      const rutCompleto = control.value;
      if (!rutCompleto) return { isValid: false };

      const rutLimpio = rutCompleto.replace(/\./g, '').replace('-', '').toLowerCase();

      if (rutLimpio.length < 8) return { isValid: false };

      const cuerpo = rutLimpio.slice(0, -1);
      const dvIngresado = rutLimpio.slice(-1);

      let suma = 0;
      let factor = 2;

      for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * factor;
        factor = factor === 7 ? 2 : factor + 1;
      }

      const resto = suma % 11;
      let dvEsperado = (11 - resto).toString();

      if (dvEsperado === '11') dvEsperado = '0';
      else if (dvEsperado === '10') dvEsperado = 'k';

      if (dvEsperado !== dvIngresado) {
        return { isValid: true }; // true indica que hay un error
      }

      return null; // válido
    }
  };
}

// Validación de Contraseñas
function passwordMatchValidator(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { noCoincide: true }; // Retorna error si no coinciden
}