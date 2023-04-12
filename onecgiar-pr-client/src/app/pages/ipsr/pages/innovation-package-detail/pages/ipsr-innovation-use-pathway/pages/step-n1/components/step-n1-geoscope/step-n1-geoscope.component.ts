import { Component, OnInit, Input } from '@angular/core';
import { RegionsCountriesService } from '../../../../../../../../../../shared/services/global/regions-countries.service';
import { IpsrStep1Body } from '../../model/Ipsr-step-1-body.model';

@Component({
  selector: 'app-step-n1-geoscope',
  templateUrl: './step-n1-geoscope.component.html',
  styleUrls: ['./step-n1-geoscope.component.scss']
})
export class StepN1GeoscopeComponent {
  @Input() body = new IpsrStep1Body();
  geoscopeOptions = [
    { full_name: 'Global', id: 1 },
    { full_name: 'Regional', id: 2 },
    { full_name: 'Country', id: 4 },
    { full_name: 'Sub-national', id: 5 }
  ];
  constructor(public regionsCountriesSE: RegionsCountriesService) {}
  get selectRegionsDescription() {
    return `The list of regions below follows the UN <a class="open_route" href="https://unstats.un.org/unsd/methodology/m49/" target='_blank'>(M.49)</a> standard`;
  }
}
