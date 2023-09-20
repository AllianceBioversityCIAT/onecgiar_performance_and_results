import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { CentersService } from 'src/app/shared/services/global/centers.service';
import { InstitutionsService } from 'src/app/shared/services/global/institutions.service';

@Component({
  selector: 'app-non-pooled-info',
  templateUrl: './non-pooled-info.component.html',
  styleUrls: ['./non-pooled-info.component.scss']
})
export class NonPooledInfoComponent implements OnInit {
  @Input() body: any;
  visible = false;

  constructor(public institutionsSE: InstitutionsService, public centersSE: CentersService, public api: ApiService) {}

  ngOnInit(): void {}
}
