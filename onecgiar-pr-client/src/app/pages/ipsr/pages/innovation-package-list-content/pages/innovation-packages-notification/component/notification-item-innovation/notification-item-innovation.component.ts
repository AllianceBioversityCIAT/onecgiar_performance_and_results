import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RetrieveModalService } from 'src/app/pages/results/pages/result-detail/components/retrieve-modal/retrieve-modal.service';
import { ShareRequestModalService } from 'src/app/pages/results/pages/result-detail/components/share-request-modal/share-request-modal.service';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-notification-item-innovation',
  templateUrl: './notification-item-innovation.component.html',
  styleUrls: ['./notification-item-innovation.component.scss']
})
export class NotificationItemInnovationComponent {
  @Input() notification: any;
  @Input() comes: boolean;
  @Input() readOnly: boolean;
  @Output() requestEvent = new EventEmitter<any>();
  requesting = false;
  submitter = true;

  constructor(public api: ApiService, private shareRequestModalSE: ShareRequestModalService, private retrieveModalSE: RetrieveModalService) {}

  mapAndAccept(notification) {
    const { title, approving_inititiative_id, owner_initiative_id, approving_official_code, approving_short_name, requester_official_code, requester_short_name, result_type_name, result_level_id, result_id, requester_initiative_id } = notification;

    this.api.dataControlSE.currentResult.title = title;

    this.api.dataControlSE.currentResult.submitter = approving_inititiative_id === owner_initiative_id ? `${approving_official_code} - ${approving_short_name}` : `${requester_official_code} - ${requester_short_name}`;

    if (this.api.rolesSE.platformIsClosed) return;
    this.retrieveModalSE.title = title;
    this.retrieveModalSE.requester_initiative_id = requester_initiative_id;
    this.api.resultsSE.currentResultId = result_id;

    if (!this.api.dataControlSE.currentResult) {
      this.api.dataControlSE.currentResult = { result_level_id };
    } else {
      this.api.dataControlSE.currentResult.result_level_id = result_level_id;
    }

    if (!this.api.dataControlSE.currentResult) this.api.dataControlSE.currentResult = {};

    this.api.dataControlSE.currentResult.result_type = result_type_name;
    this.api.dataControlSE.currentNotification = notification;
    this.shareRequestModalSE.shareRequestBody.initiative_id = approving_inititiative_id;
    this.shareRequestModalSE.shareRequestBody['official_code'] = approving_official_code;
    this.shareRequestModalSE.shareRequestBody['short_name'] = approving_short_name;
    this.api.dataControlSE.showShareRequest = true;
  }

  get isSubmitted() {
    return this.notification?.status == 1 && this.notification?.request_status_id == 1;
  }

  resultUrl(resultCode) {
    return `/ipsr/detail/${resultCode}/general-information`;
  }

  acceptOrReject(response) {
    if (this.api.rolesSE.platformIsClosed) return;
    const body = { ...this.notification, request_status_id: response ? 2 : 3 };
    this.requesting = true;
    this.api.resultsSE.PATCH_updateRequest(body).subscribe({
      next: resp => {
        this.requesting = false;
        this.api.alertsFe.show({ id: 'noti', title: response ? 'Request accepted' : 'Request rejected', status: 'success' });
        this.requestEvent.emit();
      },
      error: err => {
        this.requesting = false;
        this.api.alertsFe.show({ id: 'noti-error', title: 'Error when requesting ', description: '', status: 'error' });
        this.requestEvent.emit();
      }
    });
  }
}
