import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  rutCliente: string = '';
  pNombre: string = '';
  sNombre: string = '';
  pApellido: string = '';
  sApellido: string = '';
  fechaNacimiento: Date = new Date();
  email: string = '';
  telefono: number = 0;
  direccion: string = '';
  comuna: string = '';
  genero: string = '';
  estadoCivil: string = '';
  notificacion: boolean = false;

  constructor(private clienteService: ClienteService, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerCliente();
  }

  obtenerCliente(): void {
    const token = this.authService.getUser(); // Obtener el token
    const rutCliente = token?.rut; // Extraer el RUT del token
    this.rutCliente = rutCliente

    if (rutCliente) {
      this.clienteService.getClientes().subscribe(clientes => {
        const cliente = clientes.find(c => c.rutCliente === rutCliente);

        if (cliente) {
          this.pNombre = cliente.pNombre || '';
          this.sNombre = cliente.sNombre || '';
          this.pApellido = cliente.pApellido || '';
          this.sApellido = cliente.sApellido || '';
          this.fechaNacimiento = new Date(cliente.fechaNacimiento);
          this.email = cliente.email || '';
          this.telefono = cliente.telefono || 0;
          this.direccion = cliente.direccion || '';
          this.notificacion = cliente.idNotificacion === 1 ? true : false;

          // Obtener el nombre de la comuna recorriendo las regiones
          this.clienteService.getRegiones().subscribe(regiones => {
            regiones.forEach(region => {
              this.clienteService.getComunasByRegion(region.idRegion).subscribe(comunas => {
                const comunaEncontrada = comunas.find(c => c.idComuna === cliente.idComuna);
                if (comunaEncontrada) {
                  this.comuna = comunaEncontrada.nombre;
                }
              });
            });
          });

          // Obtener el nombre del estado civil
          this.clienteService.getEstCivil().subscribe(estadosCiviles => {
            const estadoCivilEncontrado = estadosCiviles.find(e => e.idEstCivil === cliente.idEstCivil);
            this.estadoCivil = estadoCivilEncontrado?.nombre || '';
          });

          // Obtener el nombre del género
          this.clienteService.getGeneros().subscribe(generos => {
            const generoEncontrado = generos.find(g => g.idGenero === cliente.idGenero);
            this.genero = generoEncontrado?.nombre || '';
          });
        }
      });
    }
  }
}
