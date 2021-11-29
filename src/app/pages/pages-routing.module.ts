import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { DetalleModule } from './detalle/detalle.module';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'detalle',
        loadChildren: () =>
          import('./detalle/detalle.module').then((m) => m.DetalleModule),
      },
      {
        path: 'organizacion',
        loadChildren: () =>
          import('../modules/organizacion/organizacion.module').then((m) => m.OrganizacionModule),
      },
      {
        path: 'area',
        loadChildren: () =>
          import('../modules/area/area.module').then((m) => m.AreaModule),
      },
      {
        path: 'empleado',
        loadChildren: () =>
          import('../modules/empleado/empleado.module').then((m) => m.EmpleadoModule),
      },
      {
        path: 'usuario',
        loadChildren: () =>
          import('../modules/usuario/usuario.module').then((m) => m.UsuarioModule),
      },
      {
        path: 'rol',
        loadChildren: () =>
          import('../modules/rol/rol.module').then((m) => m.RolModule),
      },
      {
        path: 'permiso',
        loadChildren: () =>
          import('../modules/permiso/permiso.module').then((m) => m.PermisoModule),
      },
      {
        path: 'documento',
        loadChildren: () =>
          import('../modules/documento/documento.module').then((m) => m.DocumentoModule),
      },
      {
        path: 'catalogo',
        loadChildren: () =>
          import('../modules/catalogo/catalogo.module').then(
            (m) => m.CatalogoModule
          ),
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
