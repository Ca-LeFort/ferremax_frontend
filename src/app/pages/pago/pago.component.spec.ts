import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoComponentCliente } from './pago.component';

describe('PagoComponent', () => {
  let component: PagoComponentCliente;
  let fixture: ComponentFixture<PagoComponentCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoComponentCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoComponentCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
