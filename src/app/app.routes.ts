import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ClienteComponent } from './pages/admin/cliente/cliente.component';
import { EmpleadoComponent } from './pages/admin/empleado/empleado.component';
import { PagoComponent } from './pages/admin/pago/pago.component';
import { PedidoComponent } from './pages/admin/pedido/pedido.component';
import { MensajeComponent } from './pages/admin/mensaje/mensaje.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'acerca-de', component: AcercaDeComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'auth/login', component: LoginComponent, title: 'Iniciar sesión - Ferremas' },
  { path: 'auth/register', component: RegisterComponent, title: 'Registrar - Ferremas'},
  { path: 'admin', component: AdminComponent },
  { path: 'cliente', component: ClienteComponent},
  { path: 'empleado', component: EmpleadoComponent},
  { path: 'pago', component: PagoComponent},
  { path: 'pedido', component: PedidoComponent},
  { path: 'mensaje', component: MensajeComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
