import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { MarcasService } from '../../services/marcas.service';

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

  constructor(private productosService: ProductosService, private marcasService: MarcasService) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerMarcas();
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
