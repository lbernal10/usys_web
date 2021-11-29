import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUpLoadModalComponent } from './components/fileupload-modal/fileupload-modal.component';
import { DocumentoService } from '../../_usys/core/services/modules/documento.service';
import { Subscription } from 'rxjs';


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
})
export class DocumentoComponent {
  isLoading: boolean;
  MODULO = 'documento';
  private subscriptions: Subscription[] = []; 

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
    private documentoService: DocumentoService
  ) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    const sb = this.documentoService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }
}