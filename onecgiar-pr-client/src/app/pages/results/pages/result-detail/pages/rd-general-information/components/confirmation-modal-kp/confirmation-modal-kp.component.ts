import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-confirmation-modal-kp',
  templateUrl: './confirmation-modal-kp.component.html',
  styleUrls: ['./confirmation-modal-kp.component.scss']
})
export class ConfirmationModalKPComponent {
  @Input() body: any;
  @Input() mqapResult: any;
  @Input() selectedResultType: any;

  confirmationText: string = '';
  isSaving: boolean = false;

  constructor(public api: ApiService, private router: Router) {}

  closeModals() {
    this.api.dataControlSE.confirmChangeResultTypeModal = false;
  }

  updateJustificationKp(newJustification: string) {
    this.confirmationText = newJustification;
  }

  changeResultType() {
    const currentUrl = this.router.url;
    this.isSaving = true;

    this.api.resultsSE.POST_createWithHandle({ ...this.mqapResult, modification_justification: this.confirmationText }).subscribe({
      next: (resp: any) => {
        this.api.alertsFe.show({ id: 'reportResultSuccess', title: 'Result type successfully updated', status: 'success', closeIn: 600 });
        this.router.navigateByUrl(`/result/result-detail/${this.api.resultsSE.currentResultId}/partners`).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
        this.api.dataControlSE.confirmChangeResultTypeModal = false;
        this.api.dataControlSE.changeResultTypeModal = false;
        this.isSaving = false;
      },
      error: err => {
        this.api.alertsFe.show({ id: 'reportResultError', title: 'Error!', description: err?.error?.message, status: 'error' });
        this.isSaving = false;
      }
    });
  }
}