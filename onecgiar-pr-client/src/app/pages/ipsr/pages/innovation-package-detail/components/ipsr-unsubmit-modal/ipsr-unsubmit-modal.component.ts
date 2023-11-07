import { Component, OnInit } from '@angular/core';
import { IpsrDataControlService } from 'src/app/pages/ipsr/services/ipsr-data-control.service';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-ipsr-unsubmit-modal',
  templateUrl: './ipsr-unsubmit-modal.component.html',
  styleUrls: ['./ipsr-unsubmit-modal.component.scss']
})
export class IpsrUnsubmitModalComponent {
  constructor(private api: ApiService, public ipsrDataControlSE: IpsrDataControlService) {}
  requesting = false;
  comment = null;

  cleanObject() {
    this.comment = null;
  }

  onSubmit() {
    this.requesting = true;
    this.api.resultsSE.PATCHSubmissionsUnsubmitIpsr(this.comment).subscribe({
      next: resp => {
        this.ipsrDataControlSE.detailData.status = resp.response?.innoPckg?.status;
        this.api.alertsFe.show({ id: 'unsubmodal', title: `Success`, description: `The result has been unsubmitted.`, status: 'success' });
        this.ipsrDataControlSE.modals.unsubmit = false;
        this.requesting = false;
      },
      error: err => {
        this.requesting = false;
        this.api.alertsFe.show({ id: 'unsubmodalerror', title: 'Error in unsubmitted', description: '', status: 'error' });
      }
    });
  }
}
