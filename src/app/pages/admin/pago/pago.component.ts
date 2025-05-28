import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../services/pago.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {
  pagos: any[] = [];

  constructor(private pagoService: PagoService) {}

  ngOnInit() {
    this.pagoService.getPagos().subscribe(data => {
      this.pagos = data;
    });
  }
}