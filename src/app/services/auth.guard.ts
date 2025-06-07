import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private alert: AlertService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const rolUsuario = localStorage.getItem('rol'); // Buscar el rol correspondiente
    const allowedRoles = route.data['roles'] as Array<string>; // Roles permitidos para la ruta

    if (allowedRoles.includes(rolUsuario!)) {
      return true;
    } else {
      this.alert.error('¡ERROR!', 'No tienes permisos para acceder a esta página') // Mensaje de error al usuario
      this.router.navigate(['auth/login']); // Redirige a la página de login si no tiene permisos
      return false;
    }
  }
}
