import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { DeleteAreaModalComponent } from './components/delete-area-modal/delete-area-modal.component';
import { EditAreaModalComponent } from './components/edit-area-modal/edit-area-modal.component';
import { AreaService } from '../../_usys/core/services/modules/area.service';
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements
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
MODULO = 'area';
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  //public customerService: CustomersService,
  public AreaService: AreaService
) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.tipoUsuario = JSON.parse( localStorage.getItem('svariable')).userType;
    this.filterForm();
    this.searchForm();
    this.AreaService.fetch(this.MODULO);
    this.grouping = this.AreaService.grouping;
    this.paginator = this.AreaService.paginator;
    this.sorting = this.AreaService.sorting;
    const sb = this.AreaService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.AreaService.patchState({ filter });
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
    this.AreaService.patchState({ searchTerm });
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
    this.AreaService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.AreaService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditAreaModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.AreaService.fetch(this.MODULO),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteAreaModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.AreaService.fetch(this.MODULO), () => { });
  }
}
