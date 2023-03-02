import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/api/auth.service';

@Component({
  selector: 'app-reporting-tool',
  templateUrl: './reporting-tool.component.html',
  styleUrls: ['./reporting-tool.component.scss']
})
export class ReportingToolComponent {
  constructor(public authSE: AuthService) {}
}
