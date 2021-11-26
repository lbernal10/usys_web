import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_usys/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteAreaModalComponent } from './components/delete-area-modal/delete-area-modal.component';
import { EditAreaModalComponent } from './components/edit-area-modal/edit-area-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AreaComponent } from './area.component';

import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AreaComponent,
    DeleteAreaModalComponent,
    EditAreaModalComponent
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
        component: AreaComponent,
      },
    ]),
  ],
  entryComponents: [
    DeleteAreaModalComponent,
    EditAreaModalComponent
  ]
})
export class AreaModule {}

