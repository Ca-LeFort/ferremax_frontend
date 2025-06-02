import { AlertService } from './../../../services/alert.service';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  //* Grupo de formularios reactivos para el registro
  registerForm = new FormGroup({
    rut: new FormControl('',
      [Validators.required,
      Validators.maxLength(10),
      Validators.pattern(/^\d{7,8}-[\dkK]$/),
      this.validarRut()
      ]),
    pnombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    snombre: new FormControl(''), //* Segundo nombre, opcional
    papellido: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    sapellido: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', Validators.required),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^9\d{8}$/) //* Valida que sea un número comenzando con 9 y tenga 9 dígitos
    ]),
    direccion: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    fechanacimiento: new FormControl('', [
      Validators.required,
      this.validarEdadMinima(18)
    ]),
    genero: new FormControl(0, Validators.required),
    estcivil: new FormControl(0, Validators.required),
    comuna: new FormControl(0, Validators.required),
    notificacion: new FormControl(1)
  }, { validators: passwordMatchValidator }); //* Validador para coincidir contraseñas

  //* Arrays para datos dinámicos
  regiones: any[] = [];
  comunas: any[] = [];
  generos: any[] = [];
  estCiviles: any[] = [];

  constructor(private clienteService: ClienteService, private alert: AlertService, private router: Router) { }

  ngOnInit() {
    this.loadInitialData(); //* Cargar datos iniciales al iniciar el componente
  }

  private loadInitialData(): void {
    //* Llama a los servicios para obtener regiones, géneros y estados civiles
    this.clienteService.getRegiones().subscribe(data => this.regiones = data);
    this.clienteService.getGeneros().subscribe(data => this.generos = data);
    this.clienteService.getEstCivil().subscribe(data => this.estCiviles = data);
  }

  registrar(): void {
    const fechaNacimiento = this.registerForm.get('fechanacimiento')?.value ?? '';
    if (!this.esMayorDeEdad(fechaNacimiento)) {
      this.alert.error('Error', 'Debes ser mayor de 18 años para registrarte.');
      return;
    }
    if (this.registerForm.invalid) {
      console.log('Formulario inválido:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          console.log(`Campo inválido: ${key}, errores:`, control.errors);
        }
      });
      return; //* Si el formulario es inválido, no proceder
    }

    const datosCliente = this.mapFormToClientData(); //* Mapea el formulario a un objeto cliente
    console.log('Datos a registrar:', datosCliente); //* Log para verificar qué datos se están enviando

    this.clienteService.registrarCliente(datosCliente).subscribe({
      next: () => {
        this.alert.success('¡Éxito!', 'Has sido registrado, bienvenido a Ferremas');
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        this.alert.error('¡Error!', error.message);
      }
    });
  }

  private esMayorDeEdad(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  }

  cargarComunas(event: Event): void {
    const idRegion = Number((event.target as HTMLSelectElement).value); //* Obtener ID de región seleccionada
    if (!idRegion || isNaN(idRegion)) {
      this.comunas = []; //* Si no es válida, limpia las comunas
      return;
    }
    this.clienteService.getComunasByRegion(idRegion).subscribe(data => this.comunas = data); //* Cargar comunas
  }

  estadoNotificacion(event: Event): void {
    const notificacion = (event.target as HTMLInputElement).checked ? 1 : 2; //* Determinar estado de notificación
    this.registerForm.patchValue({ notificacion }); //* Actualizar valor en el formulario
  }

  validarRut(): ValidatorFn {
    return (control: AbstractControl) => {
      const rutCompleto = control.value;
      if (!rutCompleto) return { invalidRut: false };

      const rutLimpio = rutCompleto.replace(/\./g, '').replace('-', '').toLowerCase();

      if (rutLimpio.length < 8) return { invalidRut: false };

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
        return { invalidRut: true }; //! true indica que hay un error
      }

      return null; //* válido
    }
  };

  validarEdadMinima(edadMinima: number): ValidatorFn {
    return (control: AbstractControl) => {
      const fechaNacimiento = control.value;
      if (!fechaNacimiento) return { edadMinima: true };

      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      return edad >= edadMinima ? null : { edadMinima: true };
    };
  }

  private mapFormToClientData(): any {
    //* Mapea los datos del formulario al objeto cliente esperado por el backend
    return {
      RutCliente: this.registerForm.get('rut')?.value || '',
      PNombre: this.registerForm.get('pnombre')?.value || '',
      SNombre: this.registerForm.get('snombre')?.value || null,
      PApellido: this.registerForm.get('papellido')?.value || '',
      SApellido: this.registerForm.get('sapellido')?.value || '',
      Email: this.registerForm.get('email')?.value || '',
      Password: this.registerForm.get('password')?.value || '',
      Telefono: Number(this.registerForm.get('telefono')?.value),
      Direccion: this.registerForm.get('direccion')?.value || '',
      FechaNacimiento: this.registerForm.get('fechanacimiento')?.value || '',
      IdGenero: Number(this.registerForm.get('genero')?.value),
      IdEstCivil: Number(this.registerForm.get('estcivil')?.value),
      IdComuna: Number(this.registerForm.get('comuna')?.value),
      IdNotificacion: Number(this.registerForm.get('notificacion')?.value)
    };
  }
}

//* Validación de contraseñas
function passwordMatchValidator(form: AbstractControl) {
  //* Valida que las contraseñas coincidan
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { noCoincide: true }; //* Devuelve error si no coinciden
}
