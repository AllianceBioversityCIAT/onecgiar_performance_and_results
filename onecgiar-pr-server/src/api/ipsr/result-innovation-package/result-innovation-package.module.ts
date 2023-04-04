import { Module } from '@nestjs/common';
import { ResultInnovationPackageService } from './result-innovation-package.service';
import { ResultInnovationPackageController } from './result-innovation-package.controller';
import { ResultRepository } from '../../../api/results/result.repository';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { VersionRepository } from '../../../api/results/versions/version.repository';
import { ResultInnovationPackageByInitiativeRepository } from '../results-package-by-initiatives/results-package-by-initiatives.respository';
import { VersionsModule } from '../../../api/results/versions/versions.module';
import { ResultRegionRepository } from '../../../api/results/result-regions/result-regions.repository';
import { ResultByInitiativesRepository } from '../../../api/results/results_by_inititiatives/resultByInitiatives.repository';
import { ResultCountryRepository } from '../../../api/results/result-countries/result-countries.repository';
import { IpsrRepository } from '../ipsr.repository';
import { ResultInnovationPackageRepository } from './repositories/result-innovation-package.repository';
import { ResultIpAAOutcomeRepository } from '../innovation-pathway/repository/result-ip-action-area-outcome.repository';
import { ClarisaActionAreaOutcomeRepository } from '../../../clarisa/clarisa-action-area-outcome/clarisa-action-area-outcome.repository';
import { ResultsImpactAreaIndicatorRepository } from 'src/api/results/results-impact-area-indicators/results-impact-area-indicators.repository';
import { ResultIpImpactAreaRepository } from '../innovation-pathway/repository/result-ip-impact-area-targets.repository';
import { resultValidationRepository } from '../../../api/results/results-validation-module/results-validation-module.repository';
import { ResultByEvidencesRepository } from '../../../api/results/results_by_evidences/result_by_evidences.repository';
import { ResultByIntitutionsTypeRepository } from '../../../api/results/results_by_institution_types/result_by_intitutions_type.repository';
import { ResultByIntitutionsRepository } from '../../../api/results/results_by_institutions/result_by_intitutions.repository';
import { ResultIpSdgTargetRepository } from '../innovation-pathway/repository/result-ip-sdg-targets.repository';

@Module({
  controllers: [ResultInnovationPackageController],
  providers: [
    ResultInnovationPackageService,
    ResultRepository,
    HandlersError,
    VersionRepository,
    ResultInnovationPackageByInitiativeRepository,
    ResultRegionRepository,
    ResultCountryRepository,
    ResultByInitiativesRepository,
    IpsrRepository,
    ResultInnovationPackageRepository,
    ResultIpAAOutcomeRepository,
    ClarisaActionAreaOutcomeRepository,
    ResultsImpactAreaIndicatorRepository,
    ResultIpImpactAreaRepository,
    ResultByEvidencesRepository,
    ResultByIntitutionsRepository,
    ResultByIntitutionsTypeRepository,
    resultValidationRepository,
    ResultIpSdgTargetRepository
  ],
  imports: [VersionsModule],
  exports: [
    ResultInnovationPackageRepository
  ]
})
export class ResultInnovationPackageModule { }
