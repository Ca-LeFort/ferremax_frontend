import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './pages/admin/admin.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title: string = 'ferremas';
  isMenuOpen: boolean = false;
  isDropdownOpen = false;
  isUserDropdownOpen = false;
  isLogged = false; //* Variable para verificar si el usuario está logueado
  user: any = null; //* Variable para almacenar la información del usuario
  mostrarPlantilla = true

  constructor(private readonly authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkLoginStatus(); //* Verificar el estado de inicio de sesión al iniciar
  }

  Plantilla(component: Component): void {
    if (component instanceof AdminComponent) {
      this.mostrarPlantilla = false
    } else {
      this.mostrarPlantilla = true
    }
  }

  getRol(): string | null {
    return localStorage.getItem('rol')
  }

  esCliente(): boolean {
    return this.getRol() === 'cliente'
  }

  esEmpleado(): boolean {
    const rolesEmpleado = ['administrador', 'encargado', 'bodeguero', 'contador'];
    return rolesEmpleado.includes(this.getRol() || '');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  private checkLoginStatus() {
    this.isLogged = this.authService.isAuthenticated(); //* Verificar si el usuario está autenticado
    if (this.isLogged) {
      this.user = this.authService.getUser(); //* Obtener la información del usuario
      console.log(this.user)
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/inicio']);
    })
  }
}
