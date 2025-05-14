import { AlertService } from './../../../services/alert.service';
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
  //* Grupo de formularios reactivos para el registro
  registerForm = new FormGroup({
    rut: new FormControl('',
      [Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d{7,8}-[\dkK]$/),
        this.validarRut()
      ]),
    pnombre: new FormControl('', Validators.required), //* Primer nombre, obligatorio
    snombre: new FormControl(''), //* Segundo nombre, opcional
    papellido: new FormControl('', Validators.required), //* Primer apellido, obligatorio
    sapellido: new FormControl('', Validators.required), //* Segundo apellido, obligatorio
    email: new FormControl('', [Validators.required, Validators.email]), //* Correo, obligatorio y con validación de formato
    password: new FormControl('', [Validators.required, Validators.minLength(8)]), //* Contraseña, obligatoria y con longitud mínima
    confirmPassword: new FormControl('', Validators.required), //* Confirmación de contraseña
    telefono: new FormControl('', Validators.required), //* Teléfono, obligatorio
    direccion: new FormControl('', Validators.required), //* Dirección, obligatoria
    fechanacimiento: new FormControl('', Validators.required), //* Fecha de nacimiento, obligatoria
    genero: new FormControl(0, Validators.required), //* Género, obligatorio (valor predeterminado 0)
    estcivil: new FormControl(0, Validators.required), //* Estado civil, obligatorio
    comuna: new FormControl(0, Validators.required), //* Comuna, obligatorio
    notificacion: new FormControl(1) //* Preferencia de notificación, por defecto 1 (habilitado)
  }, { validators: passwordMatchValidator }); //* Validador para coincidir contraseñas

  //* Arrays para datos dinámicos
  regiones: any[] = [];
  comunas: any[] = [];
  generos: any[] = [];
  estCiviles: any[] = [];

  constructor(private clienteService: ClienteService, private alert: AlertService) {}

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
    if (this.registerForm.invalid) return; //* Si el formulario es inválido, no proceder

    const datosCliente = this.mapFormToClientData(); //* Mapea el formulario a un objeto cliente
    this.clienteService.registrarCliente(datosCliente).subscribe({
      next: () => this.alert.success('¡Éxito!', 'Has sido registrado, bienvenido a Ferremas'), //* Alerta de éxito
      error: (error) => this.alert.error('¡Error!', error.message) //* Alerta de error
    });
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
    const notificacion = (event.target as HTMLInputElement).checked ? 2 : 1; //* Determinar estado de notificación
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
