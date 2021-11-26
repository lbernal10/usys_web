import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentoService } from 'src/app/_usys/core/services/modules/documento.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements OnInit {

public totalStorage = 0;
public usedStorage = 0;
public totalDocumentoUploaded = 0;
public totalUsers = 0;
public totalUsersCreated = 0;
public filtro = '';

constructor( public documentoService: DocumentoService ) { }

  ngOnInit(): void {
  //this.totalStorage =   JSON.parse( localStorage.getItem('svariable')).totalStorage;
  //this.usedStorage =   JSON.parse( localStorage.getItem('svariable')).usedStorage;
  //this.totalDocumentoUploaded =   JSON.parse( localStorage.getItem('svariable')).totalDocumentoUploaded;
  //this.totalUsers =   JSON.parse( localStorage.getItem('svariable')).totalUsers;
  //this.totalUsersCreated =   JSON.parse( localStorage.getItem('svariable')).totalUsersCreated;
  }
 
  busqueda(){
    this.documentoService.texto = this.filtro;
  }
}