import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../../../../shared/services/api/api.service';
import { IpsrStep1Body, CoreResult, Measure, Actor, Organization, Expert } from './model/Ipsr-step-1-body.model';
import { IpsrDataControlService } from '../../../../../../services/ipsr-data-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-n1',
  templateUrl: './step-n1.component.html',
  styleUrls: ['./step-n1.component.scss']
})
export class StepN1Component implements OnInit {
  ipsrStep1Body = new IpsrStep1Body();
  coreResult = new CoreResult();
  constructor(private api: ApiService, public ipsrDataControlSE: IpsrDataControlService, private router: Router) {}

  ngOnInit(): void {
    this.getSectionInformation();
    this.requestEvent();
    this.api.dataControlSE.detailSectionTitle('Step 1');
  }

  getSectionInformation() {
    this.api.resultsSE.GETInnovationPathwayByStepOneResultId().subscribe(({ response }) => {
      this.convertOrganizations(response?.innovatonUse?.organization);
      this.ipsrStep1Body = response;
      console.log(response);
      // (response);

      this.ipsrStep1Body.geo_scope_id = response.geo_scope_id == 3 ? 4 : response.geo_scope_id;
      this.coreResult = response?.coreResult;

      if (this.ipsrStep1Body.innovatonUse.measures.length == 0) {
        const oneMessure = new Measure();
        oneMessure.unit_of_measure = '# of hectares';
        this.ipsrStep1Body.innovatonUse.measures.push(oneMessure);
      }
      this.ipsrStep1Body.actionAreaOutcomes.map(item => (item.full_name = `<strong>${item.outcomeSMOcode}</strong> - ${item.outcomeStatement}`));
      this.ipsrStep1Body.sdgTargets.map(item => (item.full_name = `<strong>${item.sdg_target_code}</strong> - ${item.sdg_target}`));
      this.ipsrStep1Body.impactAreas.map(item => (item.full_name = `<strong>${item.name}</strong> - ${item.target}`));
      this.ipsrStep1Body.experts.forEach(expert => expert.expertises.map(expertItem => (expertItem.name = expertItem.obj_expertises.name)));

      this.ipsrStep1Body.institutions.map(item => (item.institutions_type_name = item.institutions_name));

      //? // (this.ipsrStep1Body);

      if (this.ipsrStep1Body.innovatonUse.actors.length == 0) {
        this.ipsrStep1Body.innovatonUse.actors.push(new Actor());
      }
      if (this.ipsrStep1Body.innovatonUse.organization.length == 0) {
        this.ipsrStep1Body.innovatonUse.organization.push(new Organization());
      }
      if (this.ipsrStep1Body.experts.length == 0) {
        this.ipsrStep1Body.experts.push(new Expert());
      }
    });
  }
  onSaveSection() {
    //("body");

    //? //(this.ipsrStep1Body);
    this.convertOrganizationsTosave();
    this.api.resultsSE.PATCHInnovationPathwayByStepOneResultId(this.ipsrStep1Body).subscribe((resp: any) => {
      //(resp?.response[0].response);
      this.ipsrDataControlSE.detailData.title = resp?.response[0].response;
      this.getSectionInformation();
    });
  }

  saveAndNextStep(descrip: string) {
    this.convertOrganizationsTosave();
    this.api.resultsSE.PATCHInnovationPathwayByStepOneResultIdNextStep(this.ipsrStep1Body, descrip).subscribe((resp: any) => {
      //(resp?.response[0].response);
      this.ipsrDataControlSE.detailData.title = resp?.response[0].response;
      this.getSectionInformation();
      setTimeout(() => {
        this.router.navigate(['/ipsr/detail/' + this.ipsrDataControlSE.resultInnovationCode + '/ipsr-innovation-use-pathway/step-2']);
      }, 1000);
    });
  }

  convertOrganizations(organizations) {
    organizations.map((item: any) => {
      if (item.parent_institution_type_id) {
        item.institution_sub_type_id = item?.institution_types_id;
        item.institution_types_id = item?.parent_institution_type_id;
      }
    });
  }

  convertOrganizationsTosave() {
    this.ipsrStep1Body.innovatonUse.organization.map((item: any) => {
      if (item.institution_sub_type_id) {
        item.institution_types_id = item.institution_sub_type_id;
      }
    });
  }
  requestEvent() {
    this.api.dataControlSE.findClassTenSeconds('alert-event').then(resp => {
      try {
        document.querySelector('.alert-event').addEventListener('click', e => {
          this.api.dataControlSE.showPartnersRequest = true;
        });
      } catch (error) {}
    });
    this.api.dataControlSE.findClassTenSeconds('alert-event-2').then(resp => {
      try {
        document.querySelector('.alert-event-2').addEventListener('click', e => {
          this.api.dataControlSE.showPartnersRequest = true;
        });
      } catch (error) {}
    });
  }
}
