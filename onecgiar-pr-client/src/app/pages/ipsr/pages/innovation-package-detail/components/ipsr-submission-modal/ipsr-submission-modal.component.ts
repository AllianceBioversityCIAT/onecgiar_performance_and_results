import { Component } from '@angular/core';
import { IpsrDataControlService } from '../../../../services/ipsr-data-control.service';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-ipsr-submission-modal',
  templateUrl: './ipsr-submission-modal.component.html',
  styleUrls: ['./ipsr-submission-modal.component.scss']
})
export class IpsrSubmissionModalComponent {
  requesting = false;
  comment = null;

  constructor(public ipsrDataControlSE: IpsrDataControlService, private api: ApiService) {}

  cleanObject() {
    this.comment = null;
  }

  onSubmit() {
    this.requesting = true;
    this.api.resultsSE.PATCHsubmissionsSubmitIpsr(this.comment).subscribe({
      next: resp => {
        this.ipsrDataControlSE.detailData.status = resp.response?.innoPckg?.status;
        this.api.alertsFe.show({ id: 'unsubmodal', title: `Success`, description: `The result has been submitted.`, status: 'success' });
        this.ipsrDataControlSE.modals.submission = false;
        this.requesting = false;
      },
      error: err => {
        this.requesting = false;
        this.api.alertsFe.show({ id: 'unsubmodalerror', title: 'Error in submission', description: '', status: 'error' });
      }
    });
  }
}
