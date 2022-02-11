import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUpLoadModalComponent } from './components/fileupload-modal/fileupload-modal.component';
import { DocumentoService } from '../../_usys/core/services/modules/documento.service';
import { Observable, of, Subscription } from 'rxjs';
import { FileElement } from 'src/app/_usys/core/models/fileElement.model';
import { Area } from 'src/app/_usys/core/models/area.model';
import { catchError, first, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_usys/core';
import { Directorio } from 'src/app/_usys/core/models/directorio.model';
import { Documento } from 'src/app/_usys/core/models/documento.model';
import { $ } from 'protractor';

const EMPTY_DIRECTORIO: Directorio = {
  idArea: null,
  nombre: undefined,
  idPadre: null,
  level: null,
  expandable: null,
  habilitado: 1,
  id: null
}

const EMPTY_AREA: Area = {
  id: undefined,
  nombre: '',
  estatus: 1, // Active = 1 | Suspended = 2 | Pending = 3
  idOrganizacion: 2
}


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  idDirectorio: number;
  name: string;
  idArea: number;
  idPadre?: number;
  nivel: 0;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    idDirectorio: 1,
    name: 'ADAPTA - Leon',
    idArea: 1,
    idPadre: 0,
    nivel: 0,
    children: [
      {
        idDirectorio: 2,
        name: 'Completo',
        idArea: 1,
        idPadre: 0,
        nivel: 0
      }, {
        idDirectorio: 3,
        name: 'Dig Sucursal',
        idArea: 1,
        idPadre: 0,
        nivel: 0
      }
    ]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  idDirectorio: number;
}
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-documento-modal',
  templateUrl: 'documento.component.html',
  styleUrls: ['documento.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
})
export class DocumentoComponent {
  isLoading: boolean;
  MODULO = 'documento';
  private subscriptions: Subscription[] = [];
  public fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;
  area: Area;
  formGroup: FormGroup;
  idArea = null;
  directorio: Directorio;
  idDirectorio = null;
 

  // function to open the modal for loading documents
  openFileUpload(direcotrio: Object) {
    const modalRef = this.modalService.open(FileUpLoadModalComponent, { size: 'xl' });
    modalRef.componentInstance.directorioSelect = direcotrio;
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      idDirectorio: node.idDirectorio
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private modalService: NgbModal,
    private documentoService: DocumentoService,
    private fb: FormBuilder
  ) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    //const sb = this.documentoService.isLoading$.subscribe(res => this.isLoading = res);
    this.documentoService.map = new Map<string, FileElement>();
    //const folderA = this.documentoService.add({ name: 'Folder A', isFolder: true, parent: 'root', id: 4 });
    /*this.documentoService.add({ name: 'Folder B', isFolder: true, parent: 'root', id: 9 });
    this.documentoService.add({ name: 'Folder C', isFolder: true, parent: 'root', id: 1 });
    this.documentoService.add({ name: 'File A', isFolder: false, parent: 'root', id: 2 });
    this.documentoService.add({ name: 'File B', isFolder: false, parent: 'root', id: 12 });
    this.documentoService.add({ name: 'Folder C', isFolder: true, parent: 'root', id: 13 });
    this.documentoService.add({ name: 'Folder C', isFolder: true, parent: 'root', id: 14 });*/
    //this.subscriptions.push(sb);
    this.updateFileElementQuery();
    this.loadAreas();
  }


  addFolder(folder: { name: string }) {
    console.log('Hi! you into to function addFolder :) ');
    // Create function for save a new directory by Area:
    console.log(this.idArea);
    this.directorio = EMPTY_DIRECTORIO;
    this.directorio.idArea = this.idArea;
    this.directorio.idPadre = this.idDirectorio;
    this.directorio.nombre = folder.name;
    console.log(this.directorio);
    this.saveDirectorio();

  }

  removeElement(element: FileElement) {
    this.documentoService.delete(element.id);
    this.updateFileElementQuery();
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    console.log('directorio: ' + element.id);
    this.idDirectorio = element.id;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      console.log('root');
      this.idDirectorio = null;
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.documentoService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.documentoService.updateDirectorio(event.element.id.toString(), { parent: event.moveTo.id.toString() });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.directorio = EMPTY_DIRECTORIO;
    console.log('click to rename the directory.'+element.name);
    this.directorio.nombre = element.name.toString();
    this.documentoService.updateRenameDirectorio('directorio', this.directorio).pipe(
      tap(() => {
      }),
      catchError((errorMessage) => {
        alert(errorMessage);
        return of(this.idArea);
      }),
    ).subscribe((directorio: Directorio) => {
      this.reloaderDirectorios();
    });
    
   // this.documentoService.updateDirectorio(element.id.toString(), { name: element.name });
    
  }

  updateFileElementQuery() {
    console.log(this.currentRoot);
    this.fileElements = this.documentoService.queryInFolder(this.currentRoot ? this.currentRoot.id.toString() : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  loadAreas() {
    const sb = this.documentoService.getAreas('areas').pipe(
      first(),
      catchError((errorMessage) => {
        alert(errorMessage);
        return of(EMPTY_AREA);
      })
    ).subscribe((area: Area) => {
      this.area = area;
      this.loadForm();
      this.subscriptions.push(sb);
    });
  }

  /**
   * Load information in the form.
   */
  loadForm() {

    this.formGroup = this.fb.group({
      area: [this.area, Validators.compose([Validators.required])]
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngcallDirectorios(areaSelect: number) {
    const area = Number(areaSelect.toString().split(':')[1]);
    this.idArea = area;

    this.documentoService.getDirectoriosByArea(this.idArea, 'areas').pipe(
      first(),
      catchError((errorMessage) => {
        console.log(errorMessage);
        return of(null);
      })
    ).subscribe((directorios: Directorio) => {

      this.documentoService.getDocumentosByArea(this.idArea, 'documentos').pipe(
        first(),
        catchError((errorMessage) => {
          console.log(errorMessage);
          return of(null);
        })
      ).subscribe((documento: Documento) => {

        console.log(directorios);
        console.log(documento);

        this.documentoService.map = new Map<string, FileElement>();
        this.updateFileElementQuery();

        for (const property in directorios) {
          console.log(directorios[property].id);
          const father = directorios[property].idPadre;
          if (father === null) {
            this.documentoService.add({ name: directorios[property].nombre, isFolder: true, parent: 'root', id: directorios[property].id });
          } else {
            this.documentoService.add({ name: directorios[property].nombre, isFolder: true, parent: father.toString(), id: directorios[property].id });
          }
          for (const propertyd in documento) {
            if (documento[propertyd].directorio.id === directorios[property].id) {
              this.documentoService.add({ name: documento[propertyd].nombre, isFolder: false, parent: directorios[property].id.toString(), id: documento[propertyd].id });
            }
          }
        }

        /*for (const propertyd in documento) {
          this.documentoService.add({ name: documento[propertyd].nombre, isFolder: false, parent: documento[propertyd].directorio.id.toString(), id: documento[propertyd].id });
        }*/
        this.updateFileElementQuery();
      });



    })

  }

  saveDirectorio() {
    this.documentoService.saveDirectorio('directorio', this.directorio).pipe(
      tap(() => {
      }),
      catchError((errorMessage) => {
        alert(errorMessage);
        return of(this.idArea);
      }),
    ).subscribe((directorio: Directorio) => {
      /*console.log(directorio);
      if (directorio.idPadre !== null) {
        this.documentoService.add({ name: directorio.nombre, isFolder: true, parent: directorio.idPadre.toString(), id: directorio.id });
      } else {
        this.documentoService.add({ name: directorio.nombre, isFolder: true, parent: 'root', id: directorio.id });
      }
      this.updateFileElementQuery();*/
      this.reloaderDirectorios();
    });
  }

  reloaderDirectorios() {
    this.documentoService.getDirectoriosByArea(this.idArea, 'areas').pipe(
      first(),
      catchError((errorMessage) => {
        console.log(errorMessage);
        return of(null);
      })
    ).subscribe((directorios: Directorio) => {

      this.documentoService.getDocumentosByArea(this.idArea, 'documentos').pipe(
        first(),
        catchError((errorMessage) => {
          console.log(errorMessage);
          return of(null);
        })
      ).subscribe((documento: Documento) => {

        console.log(directorios);
        console.log(documento);

        this.documentoService.map = new Map<string, FileElement>();
        this.updateFileElementQuery();

        for (const property in directorios) {
          console.log(directorios[property].id);
          const father = directorios[property].idPadre;
          if (father === null) {
            this.documentoService.add({ name: directorios[property].nombre, isFolder: true, parent: 'root', id: directorios[property].id });
          } else {
            this.documentoService.add({ name: directorios[property].nombre, isFolder: true, parent: father.toString(), id: directorios[property].id });
          }
          for (const propertyd in documento) {
            if (documento[propertyd].directorio.id === directorios[property].id) {
              this.documentoService.add({ name: documento[propertyd].nombre, isFolder: false, parent: directorios[property].id.toString(), id: documento[propertyd].id });
            }
          }
        }
        this.updateFileElementQuery();
      });
    })
  }

}