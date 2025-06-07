import { Component } from '@angular/core';
import { EmpleadoService } from '../../../../services/empleado.service';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearEmpleadoComponent {

  empleadoForm = new FormGroup({
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
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@(ferremas\.cl)$/)
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
    fechacontrato: new FormControl('', [
      Validators.required
    ]),
    tipoempleado: new FormControl(0, Validators.required),
    genero: new FormControl(0, Validators.required),
    estcivil: new FormControl(0, Validators.required),
    comuna: new FormControl(0, Validators.required),
  }, { validators: passwordMatchValidator }); //* Validador para coincidir contraseñas

  constructor(private empleadoService: EmpleadoService, private alert: AlertService) { }

  //* Arrays para datos dinámicos
  regiones: any[] = [];
  comunas: any[] = [];
  generos: any[] = [];
  estCiviles: any[] = [];
  tipoEmpleados: any[] = [];

  ngOnInit() {
    this.loadInitialData(); //* Cargar datos iniciales al iniciar el componente
  }

  registrar(): void {
    const fechaNacimiento = this.empleadoForm.get('fechanacimiento')?.value ?? '';
    if (!this.esMayorDeEdad(fechaNacimiento)) {
      this.alert.error('Error', 'Debe tener al menos 18 años para registrar.');
      return;
    }
    if (this.empleadoForm.invalid) {
      console.log('Formulario inválido:', this.empleadoForm.errors);
      Object.keys(this.empleadoForm.controls).forEach(key => {
        const control = this.empleadoForm.get(key);
        if (control?.invalid) {
          console.log(`Campo inválido: ${key}, errores:`, control.errors);
        }
      });
      return; //* Si el formulario es inválido, no proceder
    }

    const datosEmpleado = this.mapFormToEmpleadoData(); //* Mapea el formulario a un objeto empleado
    console.log('Datos a registrar:', datosEmpleado); //* Log para verificar qué datos se están enviando

    this.empleadoService.registrarEmpleado(datosEmpleado).subscribe({
      next: (res) => this.alert.success('¡Éxito!', 'Empleado registrado con éxito'), //* Alerta de éxito
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

  private loadInitialData(): void {
    //* Llama a los servicios para obtener regiones, géneros y estados civiles
    this.obtenerTipoEmpleados();
    this.empleadoService.getRegiones().subscribe(data => this.regiones = data);
    this.empleadoService.getGeneros().subscribe(data => this.generos = data);
    this.empleadoService.getEstCivil().subscribe(data => this.estCiviles = data);
  }

  obtenerTipoEmpleados() {
    this.empleadoService.getTipoEmpleados().subscribe({
      next: (data) => {
        // Filtrar: excluir el tipo "Administrador"
        this.tipoEmpleados = data.filter((tipo: any) => tipo.nombre !== 'Administrador');
      },
      error: (error) => {
        console.error('Error al obtener tipos de empleados:', error);
      }
    });
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

  cargarComunas(event: Event): void {
    const idRegion = Number((event.target as HTMLSelectElement).value); //* Obtener ID de región seleccionada
    if (!idRegion || isNaN(idRegion)) {
      this.comunas = []; //* Si no es válida, limpia las comunas
      return;
    }
    this.empleadoService.getComunasByRegion(idRegion).subscribe(data => this.comunas = data); //* Cargar comunas
  }

  private mapFormToEmpleadoData(): any {
    //* Mapea los datos del formulario al objeto empleado esperado por el backend
    return {
      RutEmpleado: this.empleadoForm.get('rut')?.value || '',
      PNombre: this.empleadoForm.get('pnombre')?.value || '',
      SNombre: this.empleadoForm.get('snombre')?.value || null,
      PApellido: this.empleadoForm.get('papellido')?.value || '',
      SApellido: this.empleadoForm.get('sapellido')?.value || '',
      Email: this.empleadoForm.get('email')?.value || '',
      Password: this.empleadoForm.get('password')?.value || '',
      Telefono: Number(this.empleadoForm.get('telefono')?.value),
      Direccion: this.empleadoForm.get('direccion')?.value || '',
      FechaNacimiento: this.empleadoForm.get('fechanacimiento')?.value || '',
      FechaContrato: this.empleadoForm.get('fechacontrato')?.value || '',
      cambioPassword: 0,
      IdTipoEmp: Number(this.empleadoForm.get('tipoempleado')?.value),
      IdGenero: Number(this.empleadoForm.get('genero')?.value),
      IdEstCivil: Number(this.empleadoForm.get('estcivil')?.value),
      IdComuna: Number(this.empleadoForm.get('comuna')?.value),
      IdNotificacion: Number(this.empleadoForm.get('notificacion')?.value),
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