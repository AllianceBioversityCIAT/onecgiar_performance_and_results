import { Module } from '@nestjs/common';
import { ResultsByInstitutionsService } from './results_by_institutions.service';
import { ResultsByInstitutionsController } from './results_by_institutions.controller';
import { ResultByIntitutionsRepository } from './result_by_intitutions.repository';
import {
  HandlersError,
  ReturnResponse,
} from '../../../shared/handlers/error.utils';
import { ResultRepository } from '../result.repository';
import { VersionsService } from '../versions/versions.service';
import { VersionRepository } from '../../versioning/versioning.repository';
import { ResultByInstitutionsByDeliveriesTypeRepository } from '../result-by-institutions-by-deliveries-type/result-by-institutions-by-deliveries-type.repository';
import { UserRepository } from '../../../auth/modules/user/repositories/user.repository';
import { ResultsKnowledgeProductsRepository } from '../results-knowledge-products/repositories/results-knowledge-products.repository';
import { ResultsKnowledgeProductInstitutionRepository } from '../results-knowledge-products/repositories/results-knowledge-product-institution.repository';

@Module({
  controllers: [ResultsByInstitutionsController],
  providers: [
    ResultsByInstitutionsService,
    ResultByIntitutionsRepository,
    ResultRepository,
    VersionsService,
    VersionRepository,
    HandlersError,
    ResultByInstitutionsByDeliveriesTypeRepository,
    UserRepository,
    ResultsKnowledgeProductsRepository,
    ResultsKnowledgeProductInstitutionRepository,
    ReturnResponse,
  ],
  imports: [],
  exports: [ResultByIntitutionsRepository],
})
export class ResultsByInstitutionsModule {}
