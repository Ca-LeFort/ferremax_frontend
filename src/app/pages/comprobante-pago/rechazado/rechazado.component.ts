import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rechazado',
  imports: [],
  templateUrl: './rechazado.component.html',
  styleUrl: './rechazado.component.css'
})
export class RechazadoComponent {
  statusPago: string = '';
  pagoStatus: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const statusPago = params['status'];
      if (statusPago === 'null') {
        this.pagoStatus = 'null';
      }
    })
  }
}
