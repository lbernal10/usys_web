import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersService } from '../../_usys/core/_services';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../_usys/crud-table';
import { DeleteEmpleadoModalComponent } from './components/delete-empleado-modal/delete-empleado-modal.component';
import { EditEmpleadoModalComponent } from './components/edit-empleado-modal/edit-empleado-modal.component';
import { EmpleadoService } from '../../_usys/core/services/modules/empleado.service';
@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements
OnInit,
OnDestroy,
ICreateAction,
IEditAction,
IDeleteAction,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
tipoUsuario: number;
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
MODULO = 'empleado';
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public customerService: CustomersService,
  public EmplService: EmpleadoService
) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.tipoUsuario = JSON.parse( localStorage.getItem('svariable')).userType;

    this.filterForm();
    this.searchForm();
    this.EmplService.fetch(this.MODULO);
    this.grouping = this.EmplService.grouping;
    this.paginator = this.EmplService.paginator;
    this.sorting = this.EmplService.sorting;
    const sb = this.EmplService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      type: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['estatus'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['rubro'] = type;
    }
    this.EmplService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.EmplService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.EmplService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.EmplService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditEmpleadoModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.EmplService.fetchCustomEmpleado(this.MODULO),
      () => { }
    );
  }

  delete(idEmpleado: number) {
    const modalRef = this.modalService.open(DeleteEmpleadoModalComponent);
    modalRef.componentInstance.idEmpleado = idEmpleado;
    modalRef.result.then(() => this.EmplService.fetch(this.MODULO), () => { });
  }
}
