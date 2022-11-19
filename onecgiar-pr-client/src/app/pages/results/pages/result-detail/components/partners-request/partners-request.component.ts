import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { PartnersRequestBody } from './models/partnersRequestBody.model';
import { RegionsCountriesService } from '../../../../../../shared/services/global/regions-countries.service';
import { InstitutionsService } from '../../../../../../shared/services/global/institutions.service';

@Component({
  selector: 'app-partners-request',
  templateUrl: './partners-request.component.html',
  styleUrls: ['./partners-request.component.scss']
})
export class PartnersRequestComponent {
  partnersRequestBody = new PartnersRequestBody();
  constructor(public api: ApiService, public regionsCountriesSE: RegionsCountriesService, public institutionsService: InstitutionsService) {}

  onRequestPartner() {
    console.log(this.api.rolesSE.roles);
    const { application, initiative } = this.api.rolesSE.roles;
    console.log(application);
    const { id, email, user_name } = this.api.authSE.localStorageUser;
    let initiatives = '';
    this.api.rolesSE.roles.initiative.map((init, index) => (initiatives += `Init: ${init?.initiative_id} - (${init?.description})${index < this.api.rolesSE.roles.initiative.length - 1 ? ', ' : ''}`));
    this.partnersRequestBody.externalUserName = user_name;
    this.partnersRequestBody.externalUserMail = email;
    this.partnersRequestBody.externalUserComments = `
    Result ID: ${this.api.resultsSE.currentResultId},
    Result Name: ???,
    Section: ???,
    initiatives: ${initiatives}
    User Id: ${id},
    App role: ${application?.description}`;
    console.log(this.partnersRequestBody);

    //TODO
    //     initiative role
    //
    // result
    // section
    // (editado)
    // marca_de_verificación_blanca
    // ojos
    // manos_levantadas

    // 18:27
    // + app role
    this.api.resultsSE.POST_partnerRequest(this.partnersRequestBody).subscribe(resp => {
      console.log(resp);
      this.api.alertsFe.show({ id: 'sectionSaved', title: `Partner "${this.partnersRequestBody.name}" has been requested.`, description: 'The partner request was sent successfully. You will receive a confirmation message as soon as it has been processed. The validation process usually takes 1 business day. In case of any questions, please contact the technical support.', status: 'success' });
      this.partnersRequestBody = this.partnersRequestBody = new PartnersRequestBody();
      this.api.dataControlSE.showPartnersRequest = false;
    });
  }
}
