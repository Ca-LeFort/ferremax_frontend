import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { MarcasService } from '../../services/marcas.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ]),
    ]),
  ],
})
export class InicioComponent implements OnInit, OnDestroy {
  marcas: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 4;
  productos: any[] = [];

  constructor(private marcasService: MarcasService, private productosService: ProductosService) {}

  images = [
    { src: 'https://i.imgur.com/b22csoZ.png', alt: 'Banner 1' },
    { src: 'https://i.imgur.com/JhxR6ac.jpeg', alt: 'Banner 2' },
    { src: 'https://i.imgur.com/QAsaPn1.jpeg', alt: 'Banner 3' },
  ];

  currentImageIndex = 0;
  autoSlideSubscription: Subscription = new Subscription();

  esCliente(): boolean {
    if (localStorage.getItem('rol') === 'cliente') {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.autoSlideSubscription = interval(10000).subscribe(() => {
      this.nextImage();
    });

    this.obtenerMarcas();
    this.obtenerProductos();
  }

  ngOnDestroy(): void {
    this.autoSlideSubscription.unsubscribe();
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  previousImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  obtenerMarcas(): void {
    this.marcasService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
      },
      error: (err) => {
        console.error('Error al obtener las marcas:', err.error.detail);
      },
    });
  }

  get paginatedMarcas(): any[] {
    const startIndex = this.currentPage * this.itemsPerPage;
    return this.marcas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage < this.marcas.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  totalPages(): number {
    return Math.ceil(this.marcas.length / this.itemsPerPage);
  }

  setPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage = page;
    }
  }

  obtenerProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err.error.detail);
      },
    });
  }

  get productosDestacados(): any[] {
    return this.productos.slice(0, 3); // Retorna los primeros 3 productos
  }
}
