import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import {
  GroupingState,
  PaginatorState,
} from '../../_usys/crud-table';
import { DocumentoService } from '../../_usys/core/services/modules/documento.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements
OnInit,
OnDestroy {
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = [];
closeResult: string;
public urlDocumento: SafeResourceUrl;
public nombreDocumento: string;
public urlDocumentoDescarga: string;

MODULO = 'documento';
private idOrganizacion = 2;
 // VALORES DEFAUL PARA PAGINACION INICIAL
  private apartirDe = 0;
  private mostrar = 5;
  public auxNum = 1;
  public resultados = 0;
  public filtroR='';

constructor(
  private fb: FormBuilder,
  public documentoService: DocumentoService,
  private modalService: NgbModal,
  private sanitizer: DomSanitizer
) { }

  ngOnInit(): void {
    // Invocamos la carga que queremos mostrar segun el buscador
    this.getDocumentos();
    this.getTotalCoincidences();
    this.grouping = this.documentoService.grouping;
    const sb = this.documentoService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getTotalCoincidences(){
     this.documentoService.obtenerTotalDocumentos(this.documentoService.texto).subscribe(res => this.resultados = res);
  }
  getDocumentos(){
    this.documentoService.fetchDocumentos(this.MODULO, this.documentoService.texto, this.apartirDe, this.mostrar);
  }
  
  // PAGINACION DINAMICA
  pageChange(num: number){
    if (num === 1){
      this.apartirDe = 0;
      this.mostrar = 5;
    }
    else{
      this.mostrar = num * 5;
      this.apartirDe = this.mostrar - 5;
    }
    this.auxNum = num;
    this.getDocumentos();
  }
  
  // pagination
  paginate(paginator: PaginatorState) {
    this.documentoService.patchState({ paginator });
  }
  busquedaRapida(event){
    this.documentoService.fetchDocumentos(this.MODULO, this.filtroR, this.apartirDe, this.mostrar);
    this.documentoService.obtenerTotalDocumentos(this.filtroR).subscribe(res => this.resultados = res);
  }

  
  public visualizarDocumento(content, url, nombreDocumento) {
    this.urlDocumento = this.sanitizer.bypassSecurityTrustResourceUrl(`https://docs.google.com/gview?url=${url}&embedded=true`);
    this.nombreDocumento = nombreDocumento;
    this.urlDocumentoDescarga = url;
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  public descargarDocumento(url) {
    window.open(url, '_blank', '');  
  }
}
