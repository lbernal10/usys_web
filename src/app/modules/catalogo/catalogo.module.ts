import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUDTableModule } from '../../_usys/crud-table';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogoComponent } from './catalogo.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { PermisoComponent } from './permiso/permiso.component';
import { RolComponent } from './rol/rol.component';
import { AreaComponent } from './area/area.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';



@NgModule({
  declarations: [
    CatalogoComponent,
    EmpleadoComponent, UsuarioComponent, PermisoComponent, RolComponent, AreaComponent],
  imports: [
    CommonModule,
    CatalogoRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ]
})
export class CatalogoModule { }
