import { Injectable } from '@angular/core';
import { tap, catchError, retry, throwError, pipe } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { IpsrDataControlService } from './ipsr-data-control.service';
@Injectable({
  providedIn: 'root'
})
export class IpsrCompletenessStatusService {
  flatList = {};

  constructor(private api: ApiService, private ipsrDataControlSE: IpsrDataControlService) {}
  flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object') {
        Object.assign(acc, this.flattenObject(obj[k], pre + k));
      } else if (k === 'validation') {
        acc[pre.slice(0, -1)] = Boolean(Number(obj[k]));
      }
      return acc;
    }, {});
  }

  updateGreenChecks(): any {
    // if (this.api.resultsApiSE.currentResultId) {
    this.api.resultsSE.getCompletenessStatus().subscribe(({ response }) => {
      //('updateGreenChecks');
      //(response);
      this.ipsrDataControlSE.detailData.validResult = response?.validResult;
      this.flatList = this.flattenObject(response, '');
      //(this.flatList);
      // this.submit = Boolean(response?.submit);
      // this.api.dataControlSE.green_checks = response?.green_checks;
      // this.api.resultsSE.PATCH_greenChecksByResultId().subscribe();
    });
    // }
  }
}

interface GreenChecks {
  mainSection: MainSection[];
  stepSections: StepSection[];
}

interface StepSection {
  step: number;
  sectionName: string;
  validation: boolean;
  stepSubSections?: StepSubSection[];
}

interface StepSubSection {
  subSection: number;
  sectionName: string;
  validation: boolean;
}

interface MainSection {
  sectionNAme: string;
  validation: boolean;
  lissta?: any;
}
