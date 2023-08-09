import { Injectable } from '@angular/core';
import { PhaseList } from '../../interfaces/phasesList.interface';
import { ResultsApiService } from '../api/results-api.service';
import { ModuleTypeEnum, StatusPhaseEnum } from '../../enum/api.enum';
import { ResultsListFilterService } from '../../../pages/results/pages/results-outlet/pages/results-list/services/results-list-filter.service';

@Injectable({
  providedIn: 'root'
})
export class PhasesService {
  public phases: PhaseList = {
    ipsr: [],
    reporting: []
  };

  constructor(private readonly api: ResultsApiService, private filterService: ResultsListFilterService) {
    this.api.GET_versioning(StatusPhaseEnum.ALL, ModuleTypeEnum.ALL).subscribe({
      next: ({ response }) => {
        this.phases.ipsr = response.filter(item => item.app_module_id == 2);
        this.phases.reporting = response.filter(item => item.app_module_id == 1);
        this.filterService.filters.general[1].options = this.phases.reporting.map(item => ({
          attr: item.phase_name,
          selected: item.status,
          name: `${item.phase_name} - ${item.status ? 'Open' : 'Closed'}`
        }));
      }
    });
  }
}
