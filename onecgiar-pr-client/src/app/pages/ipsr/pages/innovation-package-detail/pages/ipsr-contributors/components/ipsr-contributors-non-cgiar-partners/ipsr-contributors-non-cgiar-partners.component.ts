import { Component, OnInit, Input } from '@angular/core';
import { ContributorsBody } from '../../model/contributorsBody';
import { RolesService } from '../../../../../../../../shared/services/global/roles.service';
import { InstitutionsService } from '../../../../../../../../shared/services/global/institutions.service';

@Component({
  selector: 'app-ipsr-contributors-non-cgiar-partners',
  templateUrl: './ipsr-contributors-non-cgiar-partners.component.html',
  styleUrls: ['./ipsr-contributors-non-cgiar-partners.component.scss']
})
export class IpsrContributorsNonCgiarPartnersComponent {
  @Input() contributorsBody = new ContributorsBody();
  toggle = 0;

  constructor(public rolesSE: RolesService, public institutionsSE: InstitutionsService) {}

  validateDeliverySelection(deliveries, deliveryId) {
    if (!(typeof deliveries == 'object')) return false;
    const index = deliveries.indexOf(deliveryId);
    return index < 0 ? false : true;
  }
  onSelectDelivery(option, deliveryId) {
    // console.log('onSelectDelivery');
    if (option?.deliveries?.find((deliveryId: any) => deliveryId == 4) && deliveryId != 4) {
      return;
    }
    const index = option?.deliveries?.indexOf(deliveryId) == undefined ? -1 : option?.deliveries?.indexOf(deliveryId);
    if (deliveryId == 4 && index < 0) option.deliveries = [];
    if (!(typeof option?.deliveries == 'object')) option.deliveries = [];
    index < 0 ? option?.deliveries.push(deliveryId) : option?.deliveries.splice(index, 1);
  }
  removePartner(index) {
    this.contributorsBody.institutions.splice(index, 1);
    this.toggle++;
  }
  cleanBody() {
    // if (this.partnersBody.no_applicable_partner === true) this.partnersBody = new PartnersBody(true);
    // if (this.partnersBody.no_applicable_partner === false) this.getSectionInformation(false);
  }
}
