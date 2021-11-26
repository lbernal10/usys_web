import { Component, Input, OnDestroy, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, map, take, tap } from 'rxjs/operators';
import { Rol } from '../../../../_usys/core/models/Rol.model';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../_usys/core';
import { RolService } from '../../../../_usys/core/services/modules/rol.service';
import { Permisos } from 'src/app/_usys/core/models/permisos.model';
import { catalogoModulo } from 'src/app/_usys/core/models/catalogoModulo';
import { ArrayDataSource } from '@angular/cdk/collections';
import { Area } from 'src/app/_usys/core/models/area.model';
import { Directorio } from 'src/app/_usys/core/models/directorio.model';
import { NestedTreeControl } from '@angular/cdk/tree';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
  nombre: string;
  id: number;
}

const EMPTY_ROl: Rol = {
  id: undefined,
  descripcion: '',
  estatus: 1,
  idOrganizacion: 2
};

const EMPTY_MODULO: catalogoModulo = {
  id: undefined,
  idRol: undefined,
  idPermiso: undefined,
  idModulo: undefined,
  accionPermiso: '',
  estatusPermiso: 1,
  modulo: ''
}

const EMTY_PERMISOS: Permisos = {
  id: undefined,
  idRol: undefined,
  idPermiso: undefined,
  idModulo: undefined,
  accionPermiso: '',
  estatusPermiso: 1, // Active = 1 | Inactive = 2
  modulo: '',
  habilitado: undefined,
  idIntermedio: undefined
}

const EMPTY_DIRECTORIO: Directorio = {
  id: undefined,
  expandable: true,
  level: undefined,
  nombre: '',
  idArea: undefined,
  idPadre: undefined,
  habilitado: 0
}


@Component({
  selector: 'app-edit-rol-modal',
  templateUrl: './edit-rol-modal.component.html',
  styleUrls: ['./edit-rol-modal.component.scss'],
  // NOTE: SE MODIFICARA FALTAN SERVICES
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],

})

export class EditRolModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  rol: Rol;
  catalogoModulo: catalogoModulo;
  area: Area;
  directorio: Directorio;
  permisos: Permisos;
  formGroup: FormGroup;
  isChecked: true;
  arrPermisoSelect;
  arrDirectorioSelect;
  idModuloSelect = null;
  MODULO = 'rol';
  disabled = true;
  disabledButtonSave = true;
  private subscriptions: Subscription[] = [];
  constructor(
    private rolService: RolService,
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }
  banderaModulo = null; // 1 = nuevo registro, 2 = modificar registro;

  TREE_DATA_E: Directorio[] = [
  ];


  loading = false;

  ngOnInit(): void {
    // esta seccion se va a cambiar cuando actualice la parte de los services
    this.isLoading$ = this.rolService.isLoading$;
    this.loadCustomer();

  }

  /**
   * Load modal action information of rol.
   */
  loadCustomer() {

    if (this.id) {
      this.banderaModulo = 2;
      const sb = this.rolService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((rol: Rol) => {
        this.rol = rol;
        this.loadForm();
        this.subscriptions.push(sb);
        this.disabled = true;
        this.disabledButtonSave = false;
        this.loadCatalogoModulos();
      });
    } else {
      this.banderaModulo = 1;
      this.rol = EMPTY_ROl;
      this.catalogoModulo = EMPTY_MODULO;
      this.disabled = false;
      this.disabledButtonSave = true;
      this.ngchangeHeight();
      this.loadForm();
    }

  }

  /**
   * Load information in the form.
   */
  loadForm() {

    this.formGroup = this.fb.group({
      descripcion: [this.rol.descripcion, Validators.compose([Validators.required, Validators.maxLength(150)])],
      modulo: [this.catalogoModulo, Validators.compose([Validators.required])],
      area: [this.area, Validators.compose([Validators.required])]
    });

  }

  save() {
    this.prepareRol();
    if (this.rol.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.rolService.update(this.rol).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.rol);
      }),
    ).subscribe(res => this.rol = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.rolService.create(this.rol).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.rol);
      }),
    ).subscribe((res: Rol) => this.rol = res);
    this.subscriptions.push(sbCreate);
  }

  /**
   * @description function to save the action of enabling or disabling permission on a selected module.
   * @param action 
   * @param idIntermedio 
   */
  savePermiso(action, idIntermedio) {
    if (action === 'habilita') {
      this.rolService.createPermisoCheck('IntPermisoModulo', this.arrPermisoSelect).pipe(
        tap(() => {

        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.arrPermisoSelect);
        }),
      ).subscribe((res: Permisos) => {
        this.arrPermisoSelect = res;
        this.ngupdatedPermisoCheck(action);
      });
    } else if (action === 'desahabilita') {
      this.rolService.deleteItemsPermisoCheck('IntPermisoModulo', idIntermedio).pipe(
        tap(() => {

        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.arrPermisoSelect);
        }),
      ).subscribe((res: Permisos) => {
        this.arrPermisoSelect = res;
        this.ngupdatedPermisoCheck(action);
      });
    }

  }

  saveDirectorio(action, idIntermedio) {
    if (action === 'habilita') {
      this.rolService.createPermisoCheck('IntPermisoDirectorio', this.arrDirectorioSelect).pipe(
        tap(() => {

        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.arrDirectorioSelect);
        }),
      ).subscribe((res: Directorio) => {
        this.arrDirectorioSelect = res;
        this.ngupdatedDirectorioCheck(action);
      });
    } else if (action === 'desahabilita') {
      this.rolService.deleteItemsPermisoCheck('IntPermisoDirectorio', idIntermedio).pipe(
        tap(() => {

        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.arrDirectorioSelect);
        }),
      ).subscribe((res: Permisos) => {
        this.arrDirectorioSelect = res;
        this.ngupdatedDirectorioCheck(action);
      });
    }

  }

  private prepareRol() {
    const formData = this.formGroup.value;
    this.rol.descripcion = formData.descripcion;
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

  /**
   * @description function to load the permissions related to the selected module.
   * @param idModulo 
   */
  ngcallPermisos(idModulo: number) {
    const idModuloN = Number(idModulo.toString().split(':')[1]);
    this.idModuloSelect = idModuloN;
    this.rolService.getPermisosByRolModulo(idModuloN, this.rol.id, 'CatalogoPermiso' + '/verPermisosPorRolModulo').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMTY_PERMISOS);
      })
    ).subscribe((permisosModulosByRol: Permisos) => {
      this.permisos = permisosModulosByRol;
    });
  }

  /**
   * @description function to detect if a permission was selected.
   * @param event 
   */
  ngcheckPermiso(event) {
    let acciona;
    let idIntermedio;
    for (const property in this.permisos) {
      const idpermiso = `${this.permisos[property].idPermiso}`;
      if (Number(idpermiso) === Number(event.value)) {
        acciona = `${this.permisos[property].accion}`;
        idIntermedio = `${this.permisos[property].id}`;
      }
    }

    if (event.checked) {
      var obj = { idModulo: this.idModuloSelect, idPermiso: event.value, accion: acciona, habilitado: 1, idIntermedia: idIntermedio, idRol: this.rol.id };
      this.arrPermisoSelect = obj;
      this.savePermiso('habilita', idIntermedio);
    } else {
      var obj = { idModulo: this.idModuloSelect, idPermiso: event.value, accion: acciona, habilitado: 0, idIntermedia: idIntermedio, idRol: this.rol.id };
      this.arrPermisoSelect = obj;
      this.savePermiso('desahabilita', idIntermedio);
    }

  }

  /**
   * @description function to resize the form window.
   */
  ngchangeHeight() {
    (document.querySelector('.modal-body') as HTMLElement).style.minHeight = '150px';
  }

  /**
   * @description function to load the module catalog.
   */
  loadCatalogoModulos() {
    this.rolService.getCatalogo('CatalogoModulo').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((catalogoModulo: catalogoModulo) => {
      this.catalogoModulo = catalogoModulo;
      this.loadAreas()
    });
  }

  /**
   * @description function to visually load the selection of modified permissions.
   * @param action 
   */
  ngupdatedPermisoCheck(action) {
    for (const property in this.permisos) {
      const idpermiso = `${this.permisos[property].id}`;
      for (const objpermisosselect in this.arrPermisoSelect) {
        if (Number(idpermiso) === Number(`${this.arrPermisoSelect[objpermisosselect].idPermiso}`)) {
          //Find index of specific object using findIndex method.    
          if (action === 'habilita') {
            //Update object's name property.
            this.permisos[property].id = Number(`${this.arrPermisoSelect[objpermisosselect].idIntermedio}`);

          } else if (action === 'desahabilita') {
            //Update object's name property.
            this.permisos[property].id = 0;

          }
        }
      }
    }

  }

  ngupdatedDirectorioCheck(action) {
    for (const property in this.directorio) {
      const iddirectorio = `${this.directorio[property].id}`;
      for (const objdirectorioselect in this.arrDirectorioSelect) {
        if (Number(iddirectorio) === Number(`${this.arrDirectorioSelect[objdirectorioselect].id}`)) {
          //Find index of specific object using findIndex method.    
          if (action === 'habilita') {
            //Update object's name property.
            this.directorio[property].id = Number(`${this.arrDirectorioSelect[objdirectorioselect].dir}`);
            this.directorio[property].habilitado = 1;
          } else if (action === 'desahabilita') {
            //Update object's name property.
            this.permisos[property].id = 0;
            this.directorio[property].habilitado = 0;
          }
        }
      }
    }
  }

  /**
   * function to detect if the description value was modified.
   * @param newObj 
   */
  ngmodelChanged(newObj) {

    if (this.id) {
      this.disabledButtonSave = true;
    } else {
      this.disabledButtonSave = false;
    }

    if (this.rol.descripcion.toString() === newObj.toString() && this.id) {
      this.disabledButtonSave = false;
    }

    if (this.banderaModulo === 1) {
      this.disabledButtonSave = true;
    }

  }

  treeControl = new FlatTreeControl<Directorio>(
    node => node.level, node => node.expandable);



  checklistSelection = new SelectionModel<Directorio>(true);


  dataSource = new ArrayDataSource(this.TREE_DATA_E);

  hasChild = (_: number, node: Directorio) => node.expandable;

  getParentNode(node: Directorio): Directorio | null {
    const nodeIndex = this.TREE_DATA_E.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.TREE_DATA_E[i].level === node.level - 1) {
        return this.TREE_DATA_E[i];
      }
    }

    return null;
  }

  shouldRender(node: Directorio) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }

  ngcheckTree(event) {
    var obj;
    console.log(event.value);
    if (event.checked) {
      console.log('habilita');
      console.log(this.directorio);
      for (const children in this.directorio) {
        const idPadre = `${this.directorio[children].idPadre}`;
        if (Number(idPadre) === Number(event.value)) {
          this.checklistSelection.toggle(this.directorio[children]);
          if (Number(this.directorio[children].habilitado) === 0) {
            obj = { idIntermedio: this.directorio[children].dir, idRol: this.rol.id, idDirectorio: this.directorio[children].id, idPermisoD: 1 };
            this.arrDirectorioSelect = obj;
            this.saveDirectorio('habilita', Number(this.directorio[children].dir));
          }
          for (const children2 in this.directorio) {
            const idPadre2 = `${this.directorio[children2].idPadre}`;
            if (Number(idPadre2) === Number(this.directorio[children].id)) {
              this.checklistSelection.toggle(this.directorio[children2]);
              if (Number(this.directorio[children2].habilitado) === 0) {
                obj = { idIntermedio: this.directorio[children2].dir, idRol: this.rol.id, idDirectorio: this.directorio[children2].id, idPermisoD: 1 };
                this.arrDirectorioSelect = obj;
                this.saveDirectorio('habilita', Number(this.directorio[children2].dir));
              }
            }
          }
        }
      }
    } else {
      console.log('desahabilita');
      console.log(this.directorio);
      for (const children in this.directorio) {
        const idPadre = `${this.directorio[children].idPadre}`;
        if (Number(idPadre) === Number(event.value)) {
          this.checklistSelection.deselect(this.directorio[children]);
          if (Number(this.directorio[children].habilitado) === 1) {
            obj = { idIntermedio: this.directorio[children].dir, idRol: this.rol.id, idDirectorio: this.directorio[children].id, idPermisoD: 1 };
            this.arrDirectorioSelect = obj;
            this.saveDirectorio('desahabilita', Number(this.directorio[children].dir));
          }

          for (const children2 in this.directorio) {
            const idPadre2 = `${this.directorio[children2].idPadre}`;
            if (Number(idPadre2) === Number(this.directorio[children].id)) {
              this.checklistSelection.deselect(this.directorio[children2]);
              if (Number(this.directorio[children2].habilitado) === 1) {
                obj = { idIntermedio: this.directorio[children2].dir, idRol: this.rol.id, idDirectorio: this.directorio[children2].id, idPermisoD: 1 };
                this.arrDirectorioSelect = obj;
                this.saveDirectorio('desahabilita', Number(this.directorio[children2].dir));
              }
            }
          }
        }
      }
    }

    let idIntermedio;
    let habilitado;
    for (const property in this.directorio) {
      const iddirectorio = `${this.directorio[property].id}`;
      if (Number(iddirectorio) === Number(event.value)) {
        idIntermedio = `${this.directorio[property].dir}`;
        habilitado = `${this.directorio[property].habilitado}`;
      }
    }

    if (event.checked) {
      if (Number(habilitado) === 0) {
        obj = { idIntermedio: idIntermedio, idRol: this.rol.id, idDirectorio: event.value, idPermisoD: 1 };
        this.arrDirectorioSelect = obj;
        this.saveDirectorio('habilita', idIntermedio);
      }

    } else {
      if (Number(habilitado) === 1) {
        obj = { idIntermedio: idIntermedio, idRol: this.rol.id, idDirectorio: event.value, idPermisoD: 1 };
        this.arrDirectorioSelect = obj;
        this.saveDirectorio('desahabilita', idIntermedio);
      }

    }

  }

  /**
   * @description function to load the module catalog.
   */
  loadAreas() {
    this.rolService.getItemByIdCustomGeneral('area', 'organizacion', Number(JSON.parse(localStorage.getItem('svariable')).orgID)).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((area: Area) => {
      this.area = area;
      this.loadForm();
    });
  }

  /**
   * @description function to load the permissions related to the selected module.
   * @param idModulo 
   */
  ngcallDirectorio(idModulo: number) {
    const idModuloN = Number(idModulo.toString().split(':')[1]);
    this.idModuloSelect = idModuloN;
    console.log(this.idModuloSelect);

    this.rolService.getPermisosByRolModulo(this.rol.id, this.idModuloSelect, 'rol' + '/listarDirectoriosPorRolArea').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_DIRECTORIO);
      })
    ).subscribe((directorio: Directorio) => {
      console.log(directorio);
      this.TREE_DATA_E = [];

      this.dataSource = new ArrayDataSource(this.TREE_DATA_E);

      this.hasChild = (_: number, node: Directorio) => node.expandable;
      this.directorio = directorio;

      for (const property in directorio) {
        const expandable = `${directorio[property].expandable}`;
        const habilitado = `${directorio[property].habilitado}`;
        if (Number(expandable) === 1) {
          directorio[property].expandable = true;
          directorio[property].isExpanded = true;
        } else {
          directorio[property].expandable = false;
          directorio[property].isExpanded = false;
        }



        this.TREE_DATA_E.push(directorio[property]);
        this.dataSource = new ArrayDataSource(this.TREE_DATA_E);
        this.hasChild = (_: number, node: Directorio) => node.expandable;


      }

      for (const property in directorio) {
        const habilitado = `${directorio[property].habilitado}`;
        if (Number(habilitado) === 1) {
          this.checklistSelection.toggle(directorio[property]);
        } else {
          this.checklistSelection.deselect(directorio[property]);
        }
      }



    });





  }

}