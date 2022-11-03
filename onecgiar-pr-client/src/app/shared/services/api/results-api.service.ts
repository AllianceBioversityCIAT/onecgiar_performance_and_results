import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { ResultBody } from '../../interfaces/result.interface';
import { GeneralInfoBody } from '../../../pages/results/pages/result-detail/pages/rd-general-information/models/generalInfoBody';
import { PartnersBody } from 'src/app/pages/results/pages/result-detail/pages/rd-partners/models/partnersBody';
import { GeographicLocationBody } from '../../../pages/results/pages/result-detail/pages/rd-geographic-location/models/geographicLocationBody';
import { LinksToResultsBody } from '../../../pages/results/pages/result-detail/pages/rd-links-to-results/models/linksToResultsBody';

@Injectable({
  providedIn: 'root'
})
export class ResultsApiService {
  constructor(public http: HttpClient) {}
  apiBaseUrl = environment.apiBaseUrl + 'api/results/';
  currentResultId: number | string = null;
  GET_AllResultLevel() {
    return this.http.get<any>(`${this.apiBaseUrl}levels/all`);
  }
  GET_TypeByResultLevel() {
    return this.http.get<any>(`${this.apiBaseUrl}type-by-level/get/all`);
  }
  GET_AllResults() {
    return this.http.get<any>(`${this.apiBaseUrl}get/all`);
  }
  GET_AllResultsWithUseRole(userId) {
    return this.http.get<any>(`${this.apiBaseUrl}get/all/roles/${userId}`).pipe(
      map(resp => {
        resp.response.map(result => (result.id = Number(result.id)));
        return resp;
      })
    );
  }
  POST_resultCreateHeader(body: ResultBody) {
    return this.http.post<any>(`${this.apiBaseUrl}create/header`, body);
  }

  GET_allGenderTag() {
    return this.http.get<any>(`${this.apiBaseUrl}gender-tag-levels/all`).pipe(
      map(resp => {
        resp.response.map(institution => (institution.full_name = `(${institution?.id - 1}) ${institution?.title}`));
        return resp;
      })
    );
  }

  GET_institutionTypes() {
    return this.http.get<any>(`${this.apiBaseUrl}get/institutions-type/all`);
  }

  GET_allInstitutions() {
    return this.http.get<any>(`${this.apiBaseUrl}get/institutions/all`).pipe(
      map(resp => {
        console.log(resp);
        resp.response.map(institution => (institution.full_name = `(Id:${institution?.institutions_id}) ${institution?.institutions_acronym} - ${institution?.institutions_name} - ${institution?.headquarter_name}`));
        return resp;
      })
    );
  }

  GET_generalInformationByResultId() {
    return this.http.get<any>(`${this.apiBaseUrl}get/general-information/result/${this.currentResultId}`);
  }

  PATCH_generalInformation(body: GeneralInfoBody) {
    return this.http.patch<any>(`${this.apiBaseUrl}create/general-information`, body);
  }

  GET_resultById() {
    return this.http.get<any>(`${this.apiBaseUrl}get/${this.currentResultId}`);
  }

  GET_depthSearch(title: string) {
    return this.http.get<any>(`${this.apiBaseUrl}get/depth-search/${title}`);
  }

  PATCH_partnersSection(body: PartnersBody) {
    return this.http.patch<any>(`${this.apiBaseUrl}results-by-institutions/create/partners/${this.currentResultId}`, body);
  }
  GET_partnersSection() {
    return this.http.get<any>(`${this.apiBaseUrl}results-by-institutions/partners/result/${this.currentResultId}`);
  }

  GET_AllPrmsGeographicScope() {
    return this.http.get<any>(`${environment.apiBaseUrl}clarisa/geographic-scope/get/all/prms`);
  }

  GET_AllCLARISARegions() {
    return this.http.get<any>(`${environment.apiBaseUrl}clarisa/regions/get/all`);
  }

  GET_AllCLARISACountries() {
    return this.http.get<any>(`${environment.apiBaseUrl}clarisa/countries/get/all`).pipe(
      map(resp => {
        resp.response.map(institution => (institution.full_name = `${institution?.iso_alpha_2} - ${institution?.name}`));
        return resp;
      })
    );
  }

  PATCH_geographicSection(body: GeographicLocationBody) {
    return this.http.patch<any>(`${this.apiBaseUrl}update/geographic/${this.currentResultId}`, body);
  }

  GET_geographicSection() {
    return this.http.get<any>(`${this.apiBaseUrl}get/geographic/${this.currentResultId}`);
  }

  GET_resultsLinked() {
    return this.http.get<any>(`${this.apiBaseUrl}linked/get/${this.currentResultId}`);
  }

  PATCH_resultsLinked(body: LinksToResultsBody) {
    return this.http.post<any>(`${this.apiBaseUrl}linked/create/${this.currentResultId}`, body);
  }
}
