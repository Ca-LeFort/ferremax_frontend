import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { cuteAlert } from 'cute-alert';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit {
  pedidos: any[] = [];
  estadoPedidos: { [key: number]: string } = {};
  lstEstadoPedidos: any[] = [];
  despachos: { [key: number]: string } = {};
  sucursales: { [key: number]: string } = {};
  pedido: any;

  modalVisible: boolean = false;
  pedidoSeleccionado: any = null;

  estPedidoForm = new FormGroup({
    estadoPedido: new FormControl('', Validators.required)
  })

  private mapFormEstPedido() {
    return {
      IdEstPedido: Number(this.estPedidoForm.get('estadoPedido')?.value)
    }
  }

  constructor(private pedidoService: PedidoService, private route: ActivatedRoute, private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pedidoService.getEstadoPedidos().subscribe(estados => {
      // Crear mapa { id: nombre }
      estados.forEach(e => {
        this.estadoPedidos[e.idEstPedido] = e.nombre;
      });
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pedidoService.getPedidoPorId(+id).subscribe(data => {
        this.pedido = data;
      });
    }

    this.pedidoService.getDespachos().subscribe(estados => {
      // Crear mapa { id: nombre }
      estados.forEach(e => {
        this.despachos[e.idDespacho] = e.nombre;
      });
    });

    this.pedidoService.getSucursales().subscribe(estados => {
      // Crear mapa { id: nombre }
      estados.forEach(e => {
        this.sucursales[e.idSucursal] = e.nombre;
      });
    });

    this.obtenerEstPedidos();

    this.pedidoService.getPedidos().subscribe({
      next: (data) => { this.pedidos = data },
      error: (error) => { console.error('Error al obtener los pedidos: ', error) }
    });
  }

  obtenerEstPedidos() {
    this.pedidoService.getEstadoPedidos().subscribe({
      next: (data) => { this.lstEstadoPedidos = data },
      error: (err) => console.error('Error cargando Estado de pedidos', err)
    });
  }

  actualizarEstPedido() {
    const estPedido = this.mapFormEstPedido();

    this.pedidoService.putEstPedido(this.pedidoSeleccionado.idPedido, estPedido).subscribe({
      next: (res) => {
        this.modalVisible = false;
        this.pedidoSeleccionado = null;
        cuteAlert({
          type: 'success',
          title: 'Éxito',
          description: res.mensaje,
          primaryButtonText: 'Aceptar'
        }).then(() => {
          window.location.href = '/admin/pedido';
        });
      },
      error: (error) => {
        this.modalVisible = false;
        this.pedidoSeleccionado = null;
        cuteAlert({
          type: 'error',
          title: 'Error',
          description: error.mensaje,
          primaryButtonText: 'Aceptar'
        });
      }
    })
  }

  eliminarPedido() {
    const confirmacion =  confirm('¿Estás seguro de eliminar el pedido? Esta acción no se puede revertir')

    if (!confirmacion) {
      return;
    }

    this.pedidoService.deletePedido(this.pedidoSeleccionado.idPedido).subscribe({
      next: (res) => {
        this.modalVisible = false;
        this.pedidoSeleccionado = null;
        cuteAlert({
          type: 'success',
          title: 'Éxito',
          description: res.mensaje,
          primaryButtonText: 'Aceptar'
        }).then(() => {
          window.location.href = '/admin/pedido';
        });
      },
      error: (error) => {
        this.modalVisible = false;
        this.pedidoSeleccionado = null;
        cuteAlert({
          type: 'error',
          title: 'Error',
          description: error.mensaje,
          primaryButtonText: 'Aceptar'
        });
      }
    })
  }

  verDetallePedido(id: number) {
    this.pedidoService.getPedidoPorId(id).subscribe({
      next: (data) => {
        this.pedidoSeleccionado = data;
      },
      error: (err) => {
        console.error("Error al obtener el detalle:", err);
      }
    });
  }

  abrirModal(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.pedidoSeleccionado = null;
  }

}
