import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoComponentCliente } from './pedido.component';

describe('PedidoComponent', () => {
  let component: PedidoComponentCliente;
  let fixture: ComponentFixture<PedidoComponentCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoComponentCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoComponentCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
