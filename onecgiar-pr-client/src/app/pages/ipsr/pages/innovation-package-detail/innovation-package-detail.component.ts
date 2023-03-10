import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IpsrDataControlService } from '../../services/ipsr-data-control.service';
import { ApiService } from '../../../../shared/services/api/api.service';

@Component({
  selector: 'app-innovation-package-detail',
  templateUrl: './innovation-package-detail.component.html',
  styleUrls: ['./innovation-package-detail.component.scss']
})
export class InnovationPackageDetailComponent {
  constructor(private activatedRoute: ActivatedRoute, public ipsrDataControlSE: IpsrDataControlService, private api: ApiService) {}
  ngOnInit(): void {
    this.ipsrDataControlSE.resultInnovationCode = this.activatedRoute.snapshot.paramMap.get('id');
    this.GET_resultIdToCode();
  }

  GET_resultIdToCode() {
    this.api.resultsSE.GET_resultIdToCode(this.ipsrDataControlSE.resultInnovationCode).subscribe(
      ({ response }) => {
        console.log(response);
        this.ipsrDataControlSE.resultInnovationId = response;
      },
      err => {}
    );
  }
}
