import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api/api.service';
import { ExportTablesService } from '../../../../shared/services/export-tables.service';
import { CustomizedAlertsFeService } from '../../../../shared/services/customized-alerts-fe.service';
import { PhasesService } from '../../../../shared/services/global/phases.service';

@Component({
  selector: 'app-init-general-results-report',
  templateUrl: './init-general-results-report.component.html',
  styleUrls: ['./init-general-results-report.component.scss']
})
export class InitGeneralResultsReportComponent {
  textToFind = '';
  initiativesSelected = [];
  resultsSelected = [];
  resultsList;
  requesting = false;
  valueToFilter = null;
  requestCounter = 0;
  allInitiatives = [];
  reportingPhases: any[] = [];
  phasesSelected = [];
  resultStatusList = [];
  constructor(public api: ApiService, private exportTablesSE: ExportTablesService, private customAlertService: CustomizedAlertsFeService, private phasesSE: PhasesService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
    this.getPhases();
    this.getAllResultStatuses();
  }

  getAllResultStatuses() {
    this.api.resultsSE.GET_allResultStatuses().subscribe(({ response }) => {
      console.log(response);
      this.resultStatusList = response;
      this.resultStatusList.forEach((status: any) => {
        status.className = status.name.replace(' ', '-').toLowerCase();
      });
    });
  }

  getPhases() {
    const selectOpenPhases = (phases: any[]) => (this.phasesSelected = phases.filter((phase: any) => phase.status));
    const useAlreadyLoadedPhases = () => {
      selectOpenPhases(this.phasesSE.phases.reporting);
      this.reportingPhases = this.phasesSE.phases.reporting;
    };

    const listenWhenPhasesAreLoaded = () => {
      this.phasesSE.getPhasesObservable().subscribe((phases: any[]) => {
        this.reportingPhases = phases;
        selectOpenPhases(this.reportingPhases);
      });
    };

    this.phasesSE.phases.reporting.length ? useAlreadyLoadedPhases() : listenWhenPhasesAreLoaded();
  }

  onSelectDropdown() {
    const inits = this.initiativesSelected.map((init: any) => init.initiative_id);
    const phases = this.phasesSelected.map((phase: any) => phase.id);
    // (inits);
    this.POST_reportSesultsCompleteness(inits, phases);
  }

  async getAll() {
    this.GET_AllInitiatives();
  }

  GET_AllInitiatives() {
    //(this.api.rolesSE.isAdmin);
    if (!this.api.rolesSE.isAdmin) return;
    this.api.resultsSE.GET_AllInitiatives().subscribe(({ response }) => {
      //(response);
      this.allInitiatives = response;
    });
  }

  openFolderText() {
    return `In this <a href="https://cgiar.sharepoint.com/:f:/s/PRMSProject/Ev8QdqJv6vtPmcRvE4QLnDUB17Hke9nHOUneI1AZCI5KHg?e=5He46N"  class="open_route" target="_blank">folder</a>, you will find the latest reports that contains all the results reported in the tool. Please make sure to check the date of each report to ensure that you are always downloading the most recent version.`;
  }

  POST_reportSesultsCompleteness(inits: any[], phases: any[]) {
    this.resultsList = [];
    this.api.resultsSE.POST_reportSesultsCompleteness(inits, phases, 2).subscribe(({ response }) => {
      console.log(response);
      this.resultsList = response;

      this.resultsList.forEach((result: any) => {
        // result.full_name_html = `<div class="completeness-${result.is_submitted == 1 ? 'submitted' : 'editing'} completeness-state">${result.is_submitted == 1 ? 'Submitted' : 'Editing'}</div> <strong>Result code: (${result.result_code})</strong> - ${result.result_title}  - <strong>Official code: (${result.official_code})</strong> - <strong>Indicator category: (${result.result_type_name})</strong>`;
        // Get status name
        const status = this.resultStatusList.find((status: any) => status.status_id == result.status_id);
        const statusName = status?.name;
        const className = status?.className;
        result.full_name_html = `<div class="completeness-${className} completeness-state">${statusName}</div> <strong>Result code: (${result.result_code})</strong> - ${result.result_title}  - <strong>Official code: (${result.official_code})</strong> - <strong>Indicator category: (${result.result_type_name})</strong>`;
      });
    });
  }

  dataToExport = [];
  tocToExport = [];

  async exportExcel(resultsRelected) {
    this.dataToExport = [];
    this.tocToExport = [];
    this.requesting = true;
    this.requestCounter = 0;

    const list = [];
    const uniqueResultCodesSet = new Set(resultsRelected.map((item: any) => item.result_code));
    const uniqueResultCodes = [...uniqueResultCodesSet];
    uniqueResultCodes?.forEach(element => {
      list.push(element);
    });

    // Usar Promise.all para esperar a que todas las promesas se resuelvan
    await Promise.all(list.map((element, key) => this.POST_excelFullReportPromise(element, key)));

    this.exportTablesSE.exportMultipleSheetsExcel(this.dataToExport, 'results_list', null, this.tocToExport);
    this.requesting = false;
  }

  // validateLength(obj) {
  //   Object.keys(obj[0]).forEach(item => //(item + ': ' + obj[0][item]?.length));
  // }

  POST_excelFullReportPromise(result, key) {
    return new Promise((resolve, reject) => {
      this.api.resultsSE.POST_excelFullReport([result]).subscribe(
        ({ response }) => {
          // (response);
          // this.validateLength(response);
          //(response);
          this.requestCounter++;
          this.dataToExport.push(...response.fullReport);
          this.tocToExport.push(...response.resultsAgaintsToc);
          resolve(null);
        },
        err => {
          this.customAlertService.show({ id: 'loginAlert', title: 'Oops!', description: 'There was an error in the system while generating the report. If the issue persists, please contact the technical team.', status: 'error' });
          resolve(null);
        }
      );
    });
  }

  onRemoveinit(e) {}

  parseCheck(value) {
    return value == 0 ? 'Pending' : 'Completed';
  }
}
