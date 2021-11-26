import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Area } from '../../../../_usys/core/models/area.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { AreaService } from 'src/app/_usys/core/services/modules/area.service';

const EMPTY_CUSTOMER: Area = {
  id: undefined,
  nombre: '',
  estatus: 1,
  idOrganizacion: 2
};

@Component({
  selector: 'app-edit-area-modal',
  templateUrl: './edit-area-modal.component.html',
  styleUrls: ['./edit-area-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditAreaModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  area: Area;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private areaService: AreaService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.areaService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.area = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      const sb = this.areaService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: Area) => {
        this.area = customer;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      nombre: [this.area.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])], 
    });
  }

  save() {
    this.prepareCustomer();
    if (this.area.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.areaService.update(this.area).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.area);
      }),
    ).subscribe(res => this.area = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.areaService.create(this.area).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.area);
      }),
    ).subscribe((res: Area) => this.area = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.area.nombre = formData.nombre;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
