import { Component, Input, OnInit } from '@angular/core';
import { IpsrCompletenessStatusService } from '../../services/ipsr-completeness-status.service';

@Component({
  selector: 'app-ipsr-green-check',
  templateUrl: './ipsr-green-check.component.html',
  styleUrls: ['./ipsr-green-check.component.scss']
})
export class IpsrGreenCheckComponent {
  @Input() objectReference: string;
  constructor(public ipsrCompletenessStatusSE: IpsrCompletenessStatusService) {}
}
