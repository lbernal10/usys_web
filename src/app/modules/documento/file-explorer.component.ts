import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileElement } from 'src/app/_usys/core/models/fileElement.model';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from './components/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './components/renameDialog/renameDialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUpLoadModalComponent } from './components/fileupload-modal/fileupload-modal.component';

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {
  constructor(public dialog: MatDialog, private modalService: NgbModal) {}

  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();


  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  // function to open the modal for loading documents
  openFileUpload(direcotrio: FileElement) {
    
    const modalRef = this.modalService.open(FileUpLoadModalComponent, { size: 'xl' , backdrop: 'static'});
    modalRef.componentInstance.directorioSelect = direcotrio;
    //modalRef.componentInstance.currentRoot = direcotrio;
   
  }
}
