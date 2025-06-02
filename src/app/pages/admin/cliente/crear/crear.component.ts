import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ClienteService } from '../../../../services/cliente.service';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-crear',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearClienteComponent {
  clienteForm = new FormGroup({
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
  
    constructor(private clienteService: ClienteService, private alert: AlertService) { }
  
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
      const fechaNacimiento = this.clienteForm.get('fechanacimiento')?.value ?? '';
      if (!this.esMayorDeEdad(fechaNacimiento)) {
        this.alert.error('Error', 'Debes ser mayor de 18 años para registrarte.');
        return;
      }
      if (this.clienteForm.invalid) {
        console.log('Formulario inválido:', this.clienteForm.errors);
        Object.keys(this.clienteForm.controls).forEach(key => {
          const control = this.clienteForm.get(key);
          if (control?.invalid) {
            console.log(`Campo inválido: ${key}, errores:`, control.errors);
          }
        });
        return; //* Si el formulario es inválido, no proceder
      }
  
      const datosCliente = this.mapFormToClientData(); //* Mapea el formulario a un objeto cliente
      console.log('Datos a registrar:', datosCliente); //* Log para verificar qué datos se están enviando
  
      this.clienteService.registrarCliente(datosCliente).subscribe({
        next: (res) => this.alert.success('¡Éxito!', 'Cliente registrado con éxito'), //* Alerta de éxito
        error: (error) => {
          console.error('Error al registrar:', error); //* Log del error en caso de fallo
          this.alert.error('¡Error!', error.message); //* Alerta de error
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
      const notificacion = (event.target as HTMLInputElement).checked ? 2 : 1; //* Determinar estado de notificación
      this.clienteForm.patchValue({ notificacion }); //* Actualizar valor en el formulario
    }

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
      RutCliente: this.clienteForm.get('rut')?.value || '',
      PNombre: this.clienteForm.get('pnombre')?.value || '',
      SNombre: this.clienteForm.get('snombre')?.value || null,
      PApellido: this.clienteForm.get('papellido')?.value || '',
      SApellido: this.clienteForm.get('sapellido')?.value || '',
      Email: this.clienteForm.get('email')?.value || '',
      Password: this.clienteForm.get('password')?.value || '',
      Telefono: Number(this.clienteForm.get('telefono')?.value),
      Direccion: this.clienteForm.get('direccion')?.value || '',
      FechaNacimiento: this.clienteForm.get('fechanacimiento')?.value || '',
      IdGenero: Number(this.clienteForm.get('genero')?.value),
      IdEstCivil: Number(this.clienteForm.get('estcivil')?.value),
      IdComuna: Number(this.clienteForm.get('comuna')?.value),
      IdNotificacion: Number(this.clienteForm.get('notificacion')?.value)
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