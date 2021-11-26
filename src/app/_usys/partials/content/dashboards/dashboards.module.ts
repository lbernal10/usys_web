import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from '../../../../_usys/crud-table';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [Dashboard1Component, Dashboard2Component, DashboardWrapperComponent, Dashboard3Component],
  imports: [CommonModule,FormsModule,
    ReactiveFormsModule, WidgetsModule,  CRUDTableModule,  RouterModule],
  exports: [DashboardWrapperComponent],
})
export class DashboardsModule { }
