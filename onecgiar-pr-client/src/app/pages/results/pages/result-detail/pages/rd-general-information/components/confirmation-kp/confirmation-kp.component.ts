import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../../../../../../shared/services/api/api.service';

@Component({
  selector: 'app-confirmation-kp',
  templateUrl: './confirmation-kp.component.html',
  styleUrls: ['./confirmation-kp.component.scss']
})
export class ConfirmationKPComponent {
  @Input() body: any;
  @Input() mqapResult: any;
  @Input() selectedResultType: any;

  justification: string = '';
  isDownloading = false;

  @Output() eventTextChanged: EventEmitter<string> = new EventEmitter();

  constructor(public api: ApiService) {}

  emitJustificationUpdate() {
    this.eventTextChanged.emit(this.justification);
  }

  downloadPDF() {
    this.isDownloading = true;

    this.api.resultsSE.GET_downloadPDF(this.body.result_code, this.body.version_id).subscribe({
      next: response => {
        let fileName = 'ResultReport.pdf';
        response.headers.keys().forEach(key => {
          if (key.toLowerCase() === 'content-disposition') {
            const contentDisposition = response.headers.get(key);
            const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (match && match[1]) {
              fileName = match[1].replace(/['"]/g, '');
            }
          }
        });

        const pdfBlobUrl = URL.createObjectURL(response.body);

        const a = document.createElement('a');
        a.href = pdfBlobUrl;
        a.download = fileName;
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(pdfBlobUrl);
        this.isDownloading = false;
      },
      error: err => {
        console.error('your error handling here...', err);
        this.isDownloading = false;
      }
    });
  }
}
