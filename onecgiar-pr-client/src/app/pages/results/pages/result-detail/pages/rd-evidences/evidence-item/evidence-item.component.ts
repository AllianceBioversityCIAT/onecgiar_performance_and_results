import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { EvidencesCreateInterface } from '../model/evidencesBody.model';
import { DataControlService } from '../../../../../../../shared/services/data-control.service';
import { ApiService } from '../../../../../../../shared/services/api/api.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-evidence-item',
  templateUrl: './evidence-item.component.html',
  styleUrls: ['./evidence-item.component.scss']
})
export class EvidenceItemComponent {
  @Input() evidence: EvidencesCreateInterface;
  @Input() index: number;
  @Input() isSuppInfo: boolean;
  @Input() isOptional: boolean = false;
  @Output() deleteEvent = new EventEmitter();
  fileNameCache = '';
  incorrectFile = false;

  evidencesType = [
    { id: 0, name: 'Link' },
    { id: 1, name: 'Upload file' }
  ];

  sd = `
  <li>You confirm that the SharePoint link is publicly accessible.</li>
  <li>You confirm that all intellectual property rights related to the document at the SharePoint link have been observed. This includes any rights relevant to the document owner’s Center affiliation and any specific rights tied to content within the document, such as images.</li>
  <li>You agree to the SharePoint link being displayed on the CGIAR Results Dashboard.</li>
  `;

  validateFileTypes(file: File) {
    const validFileTypes = ['.jpg', '.png', '.pdf', '.doc', '.pptx', '.xlsx'];
    const extension = '.' + file.name.split('.').pop();
    const fileSizeInGB = file.size / (1024 * 1024 * 1024);
    return validFileTypes.includes(extension) && fileSizeInGB <= 1;
  }

  onFileSelected(event: any) {
    const selectedFile: File = event.target.files[0];
    if (selectedFile) {
      if (this.validateFileTypes(selectedFile)) {
        // Realiza las operaciones que necesites con el archivo seleccionado
        console.log(selectedFile);
        this.renameFileAndAddData(selectedFile);
        this.incorrectFile = false;
      } else {
        this.incorrectFile = true;
      }
    }
  }

  renameFileAndAddData(selectedFile) {
    const uniqueId = uuidv4();
    const fileName = selectedFile.name;
    const fileExtension = fileName.split('.').pop();
    const newFileName = `${uniqueId}.${fileExtension}`;
    this.fileNameCache = selectedFile.name;
    this.evidence.file = new File([selectedFile], newFileName, { type: selectedFile.type });
    this.evidence.fileUuid = uniqueId;
    this.evidence.sp_file_name = selectedFile.name;
  }

  constructor(public dataControlSE: DataControlService, public api: ApiService) {}

  onFileDropped(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (this.validateFileTypes(file)) {
        this.handleFile(file);
        this.incorrectFile = false;
      } else {
        this.incorrectFile = true;
        setTimeout(() => {
          this.incorrectFile = false;
        }, 3000);
      }
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleFile(file: File) {
    this.evidence.file = file;
    this.renameFileAndAddData(file);
  }

  onDeleteSPLink() {
    this.cleanSP();
  }

  cleanSP() {
    this.evidence.sp_file_name = null;
    this.evidence.link = null;
    this.evidence.file = null;
    this.evidence.fileUuid = null;
  }

  cleanLink() {
    this.evidence.link = null;
    this.evidence.is_public_file = null;
  }

  cleanSource(e) {
    if (e) {
      this.cleanLink();
    } else {
      this.cleanSP();
    }
  }
}
