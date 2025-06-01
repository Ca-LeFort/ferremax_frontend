import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-comprobante-pago',
  imports: [RouterModule],
  templateUrl: './comprobante-pago.component.html',
  styleUrl: './comprobante-pago.component.css'
})
export class ComprobantePagoComponent {
  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['/inicio']);
  }
}
