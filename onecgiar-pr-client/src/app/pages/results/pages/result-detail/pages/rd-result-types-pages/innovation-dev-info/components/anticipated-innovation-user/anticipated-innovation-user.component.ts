import { Component, Input, OnInit } from '@angular/core';
import { Actor, InnovationDevInfoBody, Measure, Organization } from '../../model/innovationDevInfoBody';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-anticipated-innovation-user',
  templateUrl: './anticipated-innovation-user.component.html',
  styleUrls: ['./anticipated-innovation-user.component.scss']
})
export class AnticipatedInnovationUserComponent implements OnInit {
  @Input() body = new InnovationDevInfoBody();
  @Input() saving: boolean = false;
  actorsTypeList = [];
  institutionsTypeTreeList = [];

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.GETAllActorsTypes();
    this.GETInstitutionsTypeTree();
  }

  checkAlert() {
    const actors = this.body.innovatonUse.actors.filter(item => item.actor_type_id !== null);
    const organizations = this.body.innovatonUse.organization.filter(item => item.is_active !== false);
    const measures = this.body.innovatonUse.measures.filter(item => item.is_active !== false);
    if (!this.body.innovation_user_to_be_determined) {
      if (actors?.length > 0 || organizations?.length > 0 || measures?.length > 0) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  GETAllActorsTypes() {
    this.api.resultsSE.GETAllActorsTypes().subscribe(({ response }) => {
      this.actorsTypeList = response;
    });
  }

  GETInstitutionsTypeTree() {
    this.api.resultsSE.GETInstitutionsTypeTree().subscribe(({ response }) => {
      this.institutionsTypeTreeList = response;
    });
  }

  getInstitutionsTypeTreeChildrens(institution_types_id) {
    const fundedList = this.institutionsTypeTreeList.find(inst => inst.code == institution_types_id);
    return fundedList?.childrens ?? [];
  }

  removeOrganization(organizationItem) {
    organizationItem.institution_sub_type_id = null;
    organizationItem.institution_types_id = null;
    organizationItem.is_active = false;
  }

  reloadSelect(organizationItem) {
    organizationItem.hide = true;
    organizationItem.institution_sub_type_id = null;
    setTimeout(() => {
      organizationItem.hide = false;
    }, 300);
  }

  removeOtherInOrg(disableOrganizations) {
    return disableOrganizations.filter(item => item.code != 78);
  }

  addOrganization() {
    this.body.innovatonUse.organization.push(new Organization());
  }

  get disableOrganizations() {
    const list = [];
    this.body.innovatonUse.organization.forEach(resp => {
      if (!resp.institution_sub_type_id) list.push({ code: resp.institution_types_id });
    });
    return list;
  }

  get getAllSubTypes() {
    const list = [];
    this.body.innovatonUse.organization.forEach(resp => {
      list.push({ code: resp.institution_sub_type_id });
    });
    return list;
  }

  hasElementsWithId(list, attr) {
    const finalList = this.api.rolesSE.readOnly ? list.filter(item => item[attr]) : list.filter(item => item.is_active != false);
    return finalList.length;
  }

  actorDescription() {
    return `<li>If the innovation does not target specific groups of actors or people, then please specify the expected innovation use at organizational level or other use below.</li>
    <li>CGIAR follows the United Nations definition of 'youth' as those persons between the ages of 15 and 24 years.</li>
    <li>We are currently working to include broader diversity dimensions beyond male, female and youth, which will be implemented in future reporting periods.</li>`;
  }

  removeOther(actors) {
    return actors.filter(item => item.actor_type_id != 5);
  }

  addActor() {
    this.body.innovatonUse.actors.push(new Actor());
  }

  addOtherMesure() {
    this.body.innovatonUse.measures.push(new Measure());
  }

  cleanActor(actorItem) {
    if (actorItem.sex_and_age_disaggregation) {
      actorItem.has_men = false;
      actorItem.has_men_youth = false;
      actorItem.has_women = false;
      actorItem.has_women_youth = false;
    }

    actorItem.women = null;
    actorItem.women_youth = null;
    actorItem.women_non_youth = null;
    actorItem.men = null;
    actorItem.men_youth = null;
    actorItem.men_non_youth = null;
    actorItem.how_many = null;
  }
}
