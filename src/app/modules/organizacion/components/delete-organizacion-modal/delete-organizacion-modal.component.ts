import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CustomersService } from '../../../../_usys/core/_services';
import { OrganizacionService } from '../../../../_usys/core/services/modules/organizacion.service';

@Component({
  selector: 'app-delete-organizacion-modal',
  templateUrl: './delete-organizacion-modal.component.html',
  styleUrls: ['./delete-organizacion-modal.component.scss']
})
export class DeleteOrganizacionModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private customersService: CustomersService,private orgService : OrganizacionService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteOrganizacion() {
    this.isLoading = true;
    const sb = this.orgService.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
