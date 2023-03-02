import { Component, OnInit } from '@angular/core';
import { internationalizationData } from '../../data/internationalizationData';
import { AuthService } from '../../services/api/auth.service';
import { ApiService } from '../../services/api/api.service';
import { DataControlService } from '../../services/data-control.service';
import { ModuleSelectorService } from '../module-selector/module-selector.service';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {
  internationalizationData = internationalizationData;
  constructor(public api: ApiService, public dataControlSE: DataControlService, public moduleSelectorSE: ModuleSelectorService) {}
  ngOnInit(): void {
    this.api.updateUserData(() => {});
  }
}
