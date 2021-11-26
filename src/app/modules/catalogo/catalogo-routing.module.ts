import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { CatalogoComponent } from './catalogo.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogoComponent,
    children: [
      {
        path: 'organizacion',
        component: CatalogoComponent,
      },
      { path: '', redirectTo: 'organizacion', pathMatch: 'full' },
      { path: '**', redirectTo: 'organizacion', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogoRoutingModule { }
