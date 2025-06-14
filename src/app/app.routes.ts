import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

// Imports de rutas
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
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { PasswordAdminComponent } from './pages/auth/password-admin/password-admin.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { PedidoComponentCliente } from './pages/pedido/pedido.component';
import { PagoComponentCliente } from './pages/pago/pago.component';
import { ComprobantePagoComponent } from './pages/comprobante-pago/comprobante-pago.component';
import { AprobadoComponent } from './pages/comprobante-pago/aprobado/aprobado.component';
import { RechazadoComponent } from './pages/comprobante-pago/rechazado/rechazado.component';
import { PendienteComponent } from './pages/comprobante-pago/pendiente/pendiente.component';
import { MisPedidosComponent } from './pages/cliente/mis-pedidos/mis-pedidos.component';
import { PerfilComponent } from './pages/cliente/perfil/perfil.component';
import { ReportesComponent } from './pages/admin/reportes/reportes.component';
import { CrearClienteComponent } from './pages/admin/cliente/crear/crear.component';
import { CrearEmpleadoComponent } from './pages/admin/empleado/crear/crear.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'acerca-de', component: AcercaDeComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'auth/login', component: LoginComponent, title: 'Iniciar sesión - Ferremas' },
  { path: 'auth/cambiar-password', component: PasswordAdminComponent, title: 'Cambiar contraseña - Ferremas' },
  { path: 'auth/register', component: RegisterComponent, title: 'Registrar - Ferremas'},
  { path: 'carrito', component: CarritoComponent, title: 'Mi carrito - Ferremas', canActivate: [AuthGuard], data: { roles: ['cliente']} },
  { path: 'pedido', component: PedidoComponentCliente, title: 'Proceso de Pedido - Ferremas', canActivate: [AuthGuard], data: { roles: ['cliente']} },
  { path: 'pago', component: PagoComponentCliente, title: 'Resumen de Pago - Ferremas', canActivate: [AuthGuard], data: { roles: ['cliente']} },
  { path: 'perfil/mis-pedidos', component: MisPedidosComponent, title: 'Mis pedidos - Ferremas', canActivate: [AuthGuard], data: { roles: ['cliente']} },
  { path: 'perfil/mi-perfil', component: PerfilComponent, title: 'Mi perfil - Ferremas', canActivate: [AuthGuard], data: { roles: ['cliente']} },

  // Rutas para comprobante con hijos de resultados
  { 
    path: 'comprobante', 
    component: ComprobantePagoComponent, 
    children: [
      { path: 'aprobado', component: AprobadoComponent },
      { path: 'rechazado', component: RechazadoComponent },
      { path: 'pendiente', component: PendienteComponent }
    ],
    title: 'Comprobante - Ferremas', 
    canActivate: [AuthGuard], data: { roles: ['cliente']}
  },

  // Ruta para Admin con rutas hijas
  {
    path: 'admin',
    component: AdminComponent, // Este sería un componente que actúa como layout para las rutas hijas
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard], data: { roles: ['administrador']} },
      { path: 'cliente/crear', component: CrearClienteComponent, canActivate: [AuthGuard], data: { roles: ['administrador']} },
      { path: 'empleado', component: EmpleadoComponent, canActivate: [AuthGuard], data: { roles: ['administrador']} },
      { path: 'empleado/crear', component: CrearEmpleadoComponent, canActivate: [AuthGuard], data: { roles: ['administrador']} },
      { path: 'pago', component: PagoComponent, canActivate: [AuthGuard], data: { roles: ['administrador', 'contador']} },
      { path: 'pedido', component: PedidoComponent, canActivate: [AuthGuard], data: { roles: ['administrador', 'encargado', 'bodeguero']} },
      { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard], data: { roles: ['administrador', 'contador']} },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirigir a una ruta hija por defecto
    ],
    canActivate: [AuthGuard], data: { roles: ['administrador', 'encargado', 'bodeguero', 'contador']}
  },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }, // Ruta wildcard para manejar rutas no encontradas
];
