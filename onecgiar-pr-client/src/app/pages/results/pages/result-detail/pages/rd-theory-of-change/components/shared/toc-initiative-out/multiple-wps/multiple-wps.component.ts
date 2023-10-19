import { Component, Input, OnInit } from '@angular/core';

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
}

@Component({
  selector: 'app-multiple-wps',
  templateUrl: './multiple-wps.component.html',
  styleUrls: ['./multiple-wps.component.scss']
})
export class MultipleWPsComponent implements OnInit {
  @Input() editable: boolean;
  @Input() initiative: any;
  @Input() resultLevelId: number | string;
  @Input() isIpsr: boolean = false;
  @Input() indexYesorNo: number;

  activeTab: any;

  constructor() {}

  ngOnInit(): void {
    console.log('this.initiative', this.initiative);
    this.activeTab = this.initiative[0];

    this.initiative.forEach((tab: any) => {
      tab.uniqueId = Math.random().toString(36).substring(7);
    });
  }

  onAddTab() {
    this.initiative.push({
      action_area_outcome_id: null,
      created_by: null,
      created_date: null,
      initiative_id: null,
      is_active: null,
      last_updated_by: null,
      last_updated_date: null,
      name: null,
      official_code: null,
      planned_result: null,
      result_toc_result_id: null,
      results_id: null,
      short_name: null,
      toc_level_id: null,
      toc_result_id: null,
      uniqueId: Math.random().toString(36).substring(7)
    });
  }

  onActiveTab(tab: any) {
    this.activeTab = tab;
    console.log('this.activeTab', this.activeTab);
  }

  onDeleteTab(tab: any) {
    if (this.initiative.length === 1) {
      return;
    }

    this.initiative = this.initiative.filter(t => t.uniqueId !== tab.uniqueId);

    this.activeTab = this.initiative[0];
  }
}
