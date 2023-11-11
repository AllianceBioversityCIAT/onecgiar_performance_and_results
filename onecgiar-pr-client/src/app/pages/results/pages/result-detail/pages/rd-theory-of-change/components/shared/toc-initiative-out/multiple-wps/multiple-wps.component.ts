import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RdTheoryOfChangesServicesService } from '../../../../rd-theory-of-changes-services.service';
import { MultipleWPsServiceService } from './services/multiple-wps-service.service';
import { CustomizedAlertsFeService } from 'src/app/shared/services/customized-alerts-fe.service';

interface Tab {
  action_area_outcome_id: number | null;
  created_by: number | null;
  created_date: string | null;
  initiative_id: number | null;
  is_active: number | null;
  last_updated_by: number | null;
  last_updated_date: string | null;
  name: string | null;
  official_code: string | null;
  planned_result: number | null;
  result_toc_result_id: string | null;
  results_id: string | null;
  short_name: string | null;
  toc_level_id: number | null;
  toc_result_id: number | null;
  uniqueId: string | null;
}

@Component({
  selector: 'app-multiple-wps',
  templateUrl: './multiple-wps.component.html',
  styleUrls: ['./multiple-wps.component.scss']
})
export class MultipleWPsComponent implements OnChanges {
  @Input() editable: boolean;
  @Input() initiative: any;
  @Input() isContributor?: boolean = false;
  @Input() isNotifications?: boolean = false;
  @Input() resultLevelId: number | string;
  @Input() isIpsr: boolean = false;
  @Input() showMultipleWPsContent: boolean = true;
  activeTab: Tab;

  constructor(public theoryOfChangesServices: RdTheoryOfChangesServicesService, public multipleWpsService: MultipleWPsServiceService, private customizedAlertsFeSE: CustomizedAlertsFeService) {}

  ngOnChanges() {
    this.initiative.result_toc_results.forEach((tab: any) => {
      tab.uniqueId = Math.random().toString(36).substring(7);
    });

    this.activeTab = this.initiative?.result_toc_results[0];
  }

  dynamicTabTitle(tabNumber) {
    return `TOC-${this.initiative?.planned_result && this.resultLevelId === 1 ? 'Output' : 'Outcome'} N° ${tabNumber}`;
  }

  getGridTemplateColumns() {
    return `repeat(${this.initiative?.result_toc_results.length}, 1fr)`;
  }

  completnessStatusValidation(tab) {
    if (this.resultLevelId === 1) {
      return tab.toc_result_id !== null;
    }

    return tab.toc_level_id !== null && tab.toc_result_id !== null;
  }

  onAddTab() {
    this.initiative.result_toc_results.push({
      action_area_outcome_id: null,
      initiative_id: this.initiative.initiative_id,
      official_code: this.initiative.official_code,
      planned_result: this.initiative.planned_result,
      results_id: null,
      short_name: this.initiative.short_name,
      toc_level_id: null,
      toc_result_id: null,
      uniqueId: Math.random().toString(36).substring(7)
    });
  }

  onActiveTab(tab: any) {
    this.activeTab = tab;
    this.showMultipleWPsContent = false;

    setTimeout(() => {
      this.showMultipleWPsContent = true;
    }, 50);
  }

  onDeleteTab(tab: any, tabNumber = 0) {
    this.customizedAlertsFeSE.show({ id: 'delete-tab', title: 'Delete confirmation', description: `Are you sure you want to delete contribution TOC-${this.initiative?.planned_result && this.resultLevelId === 1 ? 'Output' : 'Outcome'} N° ${tabNumber} to the TOC?`, status: 'warning', confirmText: 'Yes, delete' }, () => {
      if (this.initiative.result_toc_results.length === 1) {
        return;
      }

      this.initiative.result_toc_results = this.initiative.result_toc_results.filter(t => t.uniqueId !== tab.uniqueId);
      this.activeTab = this.initiative?.result_toc_results[0];

      if (this.isNotifications) return;

      if (this.isContributor) {
        this.theoryOfChangesServices.theoryOfChangeBody.contributors_result_toc_result[this.initiative.index].result_toc_results = this.initiative.result_toc_results;
      } else this.theoryOfChangesServices.theoryOfChangeBody.result_toc_result.result_toc_results = this.initiative.result_toc_results;
    });
  }
}
