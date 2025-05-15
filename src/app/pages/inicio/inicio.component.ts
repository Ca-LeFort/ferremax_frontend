import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        //* Inicia transición con opacidad en 0
        style({opacity: 0}),
        //* Anima hasta opacidad 1 en 500ms con un efecto ease-in-out
        animate('500ms ease-in-out', style({opacity: 1}))
      ]),
    ]),
  ],
})
export class InicioComponent implements OnInit, OnDestroy {

  //* Arreglo de imágenes del carrusel
  //TODO: Estas imagenes deben salir de la base de datos
  images = [
    { src: 'https://placehold.co/1920x500?text=Banner+1', alt: 'Banner 1' },
    { src: 'https://placehold.co/1920x500?text=Banner+2', alt: 'Banner 2' },
    { src: 'https://placehold.co/1920x500?text=Banner+3', alt: 'Banner 3' }
  ];

  //* Índice de la imagen actualmente mostrada
  currentImageIndex = 0;

  //* Subscripción para el slide automático (opcional)
  autoSlideSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    //* Activar slide automático cada 5 segundos (5000 ms)
    this.autoSlideSubscription = interval(5000).subscribe(() => {
      this.nextImage();
    });
  }

  ngOnDestroy(): void {
    //* Cancelar la subscripción al destruir el componente
    this.autoSlideSubscription.unsubscribe();
  }

  //* Avanza a la siguiente imagen, volviendo al inicio al finalizar el arreglo
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  //* Retrocede a la imagen anterior, regresando al último elemento si es la primera imagen
  previousImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }
}
