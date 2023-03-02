import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss']
})
export class RiskManagementComponent implements OnInit {
  constructor(public api: ApiService, private titleService: Title) {}

  ngOnInit(): void {
    this.api.rolesSE.validateReadOnly();
    this.titleService.setTitle('Risk management');
  }
}
