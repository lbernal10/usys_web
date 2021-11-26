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
import { DeleteOrganizacionModalComponent } from './components/delete-organizacion-modal/delete-organizacion-modal.component';
import { EditOrganizacionModalComponent } from './components/edit-organizacion-modal/edit-organizacion-modal.component';
import { OrganizacionService } from '../../_usys/core/services/modules/organizacion.service';
import {EditOrganizacionParametrosModalComponent} from './components/edit-organizacion-parametros-modal/edit-organizacion-parametros-modal.component';
@Component({
  selector: 'app-organizacion',
  templateUrl: './organizacion.component.html',
  styleUrls: ['./organizacion.component.scss']
})
export class OrganizacionComponent implements
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
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
MODULO = 'organizacion';
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public customerService: CustomersService,
  public OrgService: OrganizacionService
) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    console.log('idor en org ' + JSON.parse( localStorage.getItem('svariable')).orgID);
    this.filterForm();
    this.searchForm();
    this.OrgService.fetch(this.MODULO);
    this.grouping = this.OrgService.grouping;
    this.paginator = this.OrgService.paginator;
    this.sorting = this.OrgService.sorting;
    const sb = this.OrgService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.OrgService.patchState({ filter });
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
    this.OrgService.patchState({ searchTerm });
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
    this.OrgService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.OrgService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditOrganizacionModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.OrgService.fetch(this.MODULO),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteOrganizacionModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.OrgService.fetch(this.MODULO), () => { });
  }
  parametros(id: number) {
    const modalRef = this.modalService.open(EditOrganizacionParametrosModalComponent, { size: 'sm' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.OrgService.fetch(this.MODULO),
      () => { }
    );
  }
}
