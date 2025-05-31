import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { MarcasService } from '../../services/marcas.service';
import { CarritoService } from '../../services/carrito.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  marcas: any[] = [];
  marcaSeleccionada: string = '';
  carritoId: number = 0;

  constructor(private productosService: ProductosService,
    private marcasService: MarcasService,
    private carritoService: CarritoService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerMarcas();
    this.carritoService.obtenerCarritoActivo().subscribe({
      next: (carrito) => {
        this.carritoId = carrito.idCarrito;
        localStorage.setItem('carritoId', this.carritoId.toString());
      },
      error: (err) => {
        console.error("No se pudo obtener el carrito activo", err);
      }
    });
  }

  obtenerProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log(data);
        this.productosFiltrados = data; //* Inicialmente mostrar todos los productos
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err.error.detail);
      },
    });
  }

  agregarAlCarrito(productoId: number) {
    const cantidad = 1;

    this.carritoService.agregarProducto(this.carritoId, productoId, cantidad).subscribe({
      next: () => {
        this.alertService.success("Exito", "Producto agregado al carrito");
      },
      error: (error) => {
        console.error("Error al agregar producto:", error);
        this.alertService.error("Error", "No se pudo agregar el producto al carrito");
      }
    })
  }

  obtenerMarcas(): void {
    this.marcasService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error al obtener las marcas:', err.error.detail);
      },
    });
  }

  filtrarPorMarca(event: Event): void {
    const marcaSeleccionada = (event.target as HTMLSelectElement).value;
    this.marcaSeleccionada = marcaSeleccionada;

    if (marcaSeleccionada) {
      const idMarcaSeleccionada = parseInt(marcaSeleccionada, 10);
      this.productosFiltrados = this.productos.filter(
        (producto) => producto.id_marca === idMarcaSeleccionada,
      );

      console.log('Marca seleccionada ID:', idMarcaSeleccionada);
      console.log('Productos encontrados:', this.productosFiltrados);
    } else {
      this.productosFiltrados = this.productos; // Mostrar todos los productos si no se selecciona marca
      console.log('No se seleccionó marca, mostrando todos los productos');
    }
  }
}
