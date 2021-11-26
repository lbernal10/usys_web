import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CustomersService } from '../../../../_usys/core/_services';
import { RolService } from '../../../../_usys/core/services/modules/rol.service';

@Component({
  selector: 'app-delete-rol-modal',
  templateUrl: './delete-rol-modal.component.html',
  styleUrls: ['./delete-rol-modal.component.scss']
})
export class DeleteRolModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private customersService: CustomersService, private rolService: RolService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRol() {
    this.isLoading = true;
    this.rolService.deletePermisoRol(this.id, 'IntPermisoModulo').pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => {
      }),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.rolService.delete(this.id).pipe(
          tap(() => {
            this.modal.close();
          }),
          catchError((err) => {
            this.modal.dismiss(err);
            return of(undefined);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe();
      })
    ).subscribe();
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
