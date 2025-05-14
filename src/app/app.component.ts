import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

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
  isLogged = false; //* Variable para verificar si el usuario está logueado
  user: any = null; //* Variable para almacenar la información del usuario

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus(); //* Verificar el estado de inicio de sesión al iniciar
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  private checkLoginStatus() {
    this.isLogged = this.authService.isAuthenticated(); //* Verificar si el usuario está autenticado
    if (this.isLogged) {
      this.user = this.authService.getUser(); //* Obtener la información del usuario
      console.log(this.user)
    }
  }
}
