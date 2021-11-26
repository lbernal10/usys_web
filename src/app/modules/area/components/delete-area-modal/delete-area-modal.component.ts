import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CustomersService } from '../../../../_usys/core/_services';
import { AreaService } from 'src/app/_usys/core/services/modules/area.service';

@Component({
  selector: 'app-delete-area-modal',
  templateUrl: './delete-area-modal.component.html',
  styleUrls: ['./delete-area-modal.component.scss']
})
export class DeleteAreaModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private areaService: AreaService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteCustomer() {
    this.isLoading = true;
    const sb = this.areaService.delete(this.id).pipe(
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
