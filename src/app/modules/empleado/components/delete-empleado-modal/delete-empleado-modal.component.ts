import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { EmpleadoService } from '../../../../_usys/core/services/modules/empleado.service';
import { CustomEmpleadoEdit } from 'src/app/_usys/core/models/customEmpleadoEdit.model';

@Component({
  selector: 'app-delete-empleado-modal',
  templateUrl: './delete-empleado-modal.component.html',
  styleUrls: ['./delete-empleado-modal.component.scss']
})
export class DeleteEmpleadoModalComponent implements OnInit, OnDestroy {
  @Input() idEmpleado: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  customEmpleadoEdit: CustomEmpleadoEdit;

  constructor(private customersService: EmpleadoService, private emplService: EmpleadoService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteEmpleado() {
    this.isLoading = true;

    this.customersService.getItemByIdCustomGeneral('empleado', 'ver', this.idEmpleado).pipe(
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }), finalize(() => {
        console.log(this.customEmpleadoEdit);
        const sb = this.emplService.deleteCustomModulo('Usuario', this.customEmpleadoEdit.idUsuario).pipe(
          catchError((err) => {
            this.modal.dismiss(err);
            return of(undefined);
          }),
          finalize(() => {
            // delete empleado:
            const sbe = this.emplService.delete(this.customEmpleadoEdit.idEmpleado).pipe(
              catchError((err) => {
                this.modal.dismiss(err);
                return of(undefined);
              }),
              finalize(() => {
                // delete persona:
                const sbp = this.emplService.deleteCustomModulo('Persona', this.customEmpleadoEdit.idPersona).pipe(
                  delay(1000),
                  tap(() => this.modal.close()),
                  catchError((err) => {
                    this.modal.dismiss(err);
                    return of(undefined);
                  }),
                  finalize(() => {
                    this.isLoading = false;
                  })
                ).subscribe();
                this.subscriptions.push(sbp);
              })
            ).subscribe();
            this.subscriptions.push(sbe);
          })
        ).subscribe();
        this.subscriptions.push(sb);
      })
    ).subscribe((customEmpleadoEdit: CustomEmpleadoEdit) => {
      console.log(this.customEmpleadoEdit);
      this.customEmpleadoEdit = customEmpleadoEdit;
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
