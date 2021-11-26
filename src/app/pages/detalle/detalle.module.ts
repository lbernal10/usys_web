import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DetalleComponent } from './detalle.component';
import { CRUDTableModule } from 'src/app/_usys/crud-table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { SplashScreenModule } from '../../_usys/partials/layout/splash-screen/splash-screen.module';

@NgModule({
  declarations: [DetalleComponent],
  imports: [
    SplashScreenModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetalleComponent,
      },
    ]),
  ],
})
export class DetalleModule { }
