import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_usys/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteOrganizacionModalComponent } from './components/delete-organizacion-modal/delete-organizacion-modal.component';
import { EditOrganizacionModalComponent } from './components/edit-organizacion-modal/edit-organizacion-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizacionComponent } from './organizacion.component';

import { RouterModule } from '@angular/router';
import { EditOrganizacionParametrosModalComponent } from './components/edit-organizacion-parametros-modal/edit-organizacion-parametros-modal.component';
@NgModule({
  declarations: [
    OrganizacionComponent,
    DeleteOrganizacionModalComponent,
    EditOrganizacionModalComponent,
    EditOrganizacionParametrosModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: OrganizacionComponent,
      },
    ]),
  ],
  entryComponents: [
    DeleteOrganizacionModalComponent,
    EditOrganizacionModalComponent,
    EditOrganizacionParametrosModalComponent
  ]
})
export class OrganizacionModule {}
