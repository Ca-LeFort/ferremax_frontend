import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MensajeService } from '../../services/mensaje.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  imports: [FormsModule],
  templateUrl: './contacto.component.html'
})
export class ContactoComponent {
  mensaje = { nombre: '', apellido: '', email: '', contenido: '' };

  constructor(private mensajeService: MensajeService, private router: Router) {}

  enviarMensaje() {
    this.mensajeService.addMensaje(this.mensaje);
    this.router.navigate(['/mensaje']);
  }
}
export class AppModule {}
