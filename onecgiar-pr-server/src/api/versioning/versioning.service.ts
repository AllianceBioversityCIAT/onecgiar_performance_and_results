import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { CreateVersioningDto } from './dto/create-versioning.dto';
import { UpdateVersioningDto } from './dto/update-versioning.dto';
import { Version } from './entities/version.entity';
import { VersionRepository } from './versioning.repository';
import { Result } from '../results/entities/result.entity';
import { ResultRepository } from '../results/result.repository';
import { ApplicationModules } from './entities/application-modules.entity';
import { ApplicationModulesRepository } from './repositories/application-modules.repository';
import {
  ReturnResponse,
  ReturnResponseDto,
} from '../../shared/handlers/error.utils';
import { env } from 'process';
import { TokenDto } from '../../shared/globalInterfaces/token.dto';
import { NonPooledProjectRepository } from '../results/non-pooled-projects/non-pooled-projects.repository';
import { ResultsCenterRepository } from '../results/results-centers/results-centers.repository';
import { ResultsTocResultRepository } from '../results/results-toc-results/results-toc-results.repository';
import { ResultByInitiativesRepository } from '../results/results_by_inititiatives/resultByInitiatives.repository';
import { ResultByIntitutionsRepository } from '../results/results_by_institutions/result_by_intitutions.repository';
import { ResultByInstitutionsByDeliveriesTypeRepository } from '../results/result-by-institutions-by-deliveries-type/result-by-institutions-by-deliveries-type.repository';
import { ResultByIntitutionsTypeRepository } from '../results/results_by_institution_types/result_by_intitutions_type.repository';
import { ResultCountryRepository } from '../results/result-countries/result-countries.repository';
import { ResultRegionRepository } from '../results/result-regions/result-regions.repository';
import { LinkedResultRepository } from '../results/linked-results/linked-results.repository';
import { EvidencesRepository } from '../results/evidences/evidences.repository';
import { ResultsCapacityDevelopmentsRepository } from '../results/summary/repositories/results-capacity-developments.repository';
import { ResultsImpactAreaIndicatorRepository } from '../results/results-impact-area-indicators/results-impact-area-indicators.repository';
import { ResultsPolicyChangesRepository } from '../results/summary/repositories/results-policy-changes.repository';
import { ResultsInnovationsDevRepository } from '../results/summary/repositories/results-innovations-dev.repository';
import { ResultsInnovationsUseRepository } from '../results/summary/repositories/results-innovations-use.repository';
import { ResultsInnovationsUseMeasuresRepository } from '../results/summary/repositories/results-innovations-use-measures.repository';
import { ResultsKnowledgeProductsRepository } from '../results/results-knowledge-products/repositories/results-knowledge-products.repository';
import { ResultsKnowledgeProductAltmetricRepository } from '../results/results-knowledge-products/repositories/results-knowledge-product-altmetrics.repository';
import { ResultsKnowledgeProductAuthorRepository } from '../results/results-knowledge-products/repositories/results-knowledge-product-authors.repository';
import { ResultsKnowledgeProductKeywordRepository } from '../results/results-knowledge-products/repositories/results-knowledge-product-keywords.repository';
import { ResultsKnowledgeProductMetadataRepository } from '../results/results-knowledge-products/repositories/results-knowledge-product-metadata.repository';
import { ResultsKnowledgeProductInstitutionRepository } from '../results/results-knowledge-products/repositories/results-knowledge-product-institution.repository';
import {
  AppModuleIdEnum,
  ModuleTypeEnum,
  StatusPhaseEnum,
} from '../../shared/constants/role-type.enum';

@Injectable()
export class VersioningService {
  private readonly _logger: Logger = new Logger(VersioningService.name);

  constructor(
    private readonly _versionRepository: VersionRepository,
    private readonly _resultRepository: ResultRepository,
    private readonly _applicationModulesRepository: ApplicationModulesRepository,
    private readonly _returnResponse: ReturnResponse,
    private readonly _nonPooledProjectRepository: NonPooledProjectRepository,
    private readonly _resultsCenterRepository: ResultsCenterRepository,
    private readonly _resultsTocResultRepository: ResultsTocResultRepository,
    private readonly _resultByInitiativesRepository: ResultByInitiativesRepository,
    private readonly _resultByIntitutionsRepository: ResultByIntitutionsRepository,
    private readonly _resultByInstitutionsByDeliveriesTypeRepository: ResultByInstitutionsByDeliveriesTypeRepository,
    private readonly _resultByIntitutionsTypeRepository: ResultByIntitutionsTypeRepository,
    private readonly _resultCountryRepository: ResultCountryRepository,
    private readonly _resultRegionRepository: ResultRegionRepository,
    private readonly _linkedResultRepository: LinkedResultRepository,
    private readonly _evidencesRepository: EvidencesRepository,
    private readonly _resultsCapacityDevelopmentsRepository: ResultsCapacityDevelopmentsRepository,
    private readonly _resultsImpactAreaIndicatorRepository: ResultsImpactAreaIndicatorRepository,
    private readonly _resultsPolicyChangesRepository: ResultsPolicyChangesRepository,
    private readonly _resultsInnovationsDevRepository: ResultsInnovationsDevRepository,
    private readonly _resultsInnovationsUseRepository: ResultsInnovationsUseRepository,
    private readonly _resultsInnovationsUseMeasuresRepository: ResultsInnovationsUseMeasuresRepository,
    private readonly _resultsKnowledgeProductsRepository: ResultsKnowledgeProductsRepository,
    private readonly _resultsKnowledgeProductAltmetricRepository: ResultsKnowledgeProductAltmetricRepository,
    private readonly _resultsKnowledgeProductAuthorRepository: ResultsKnowledgeProductAuthorRepository,
    private readonly _resultsKnowledgeProductKeywordRepository: ResultsKnowledgeProductKeywordRepository,
    private readonly _resultsKnowledgeProductMetadataRepository: ResultsKnowledgeProductMetadataRepository,
    private readonly _resultsKnowledgeProductInstitutionRepository: ResultsKnowledgeProductInstitutionRepository,
  ) {}

  /**
   *  @important The prefix $_ indicates that this method is for internal
   *  application use only.
   */

  /**
   *  Retrieves the active version from the database.
   *  @important This method should only be used internally.
   *  @returns {Promise<Version>} The active version.
   *  @throws {Error} If an error occurs while retrieving the active version
   *  and return null.
   */
  async $_findActivePhase(module_id: AppModuleIdEnum): Promise<Version> {
    try {
      const version = await this._versionRepository.findOne({
        where: {
          status: true,
          is_active: true,
          app_module_id: module_id,
        },
      });

      return version;
    } catch (error) {
      return null;
    }
  }

  async $_findPhase(phase_id: number): Promise<Version> {
    try {
      const version = await this._versionRepository.findOne({
        where: {
          id: phase_id,
          is_active: true,
        },
      });

      return version;
    } catch (error) {
      return null;
    }
  }

  async $_genericValidation(
    result_code: number,
    phase_id: number,
  ): Promise<boolean> {
    try {
      const res = await this._resultRepository.findOne({
        where: {
          version_id: phase_id,
          result_code: result_code,
          is_active: true,
        },
      });
      return res ? false : true;
    } catch (error) {
      return false;
    }
  }

  async $_phaseChangeReporting(result: Result, phase: Version, user: TokenDto) {
    try {
      this._logger.log(
        `REPORTING: Phase change in the ${result.id} result to the phase [${phase.id}]:${phase.phase_name} .`,
      );
      const data = await this._resultRepository.replicable({
        old_result_id: result.id,
        phase: phase.id,
        user: user,
      });

      const config = {
        old_result_id: result.id,
        new_result_id: data.id,
        phase: phase.id,
        user: user,
      };

      await this._resultByInitiativesRepository.replicable(config);

      switch (parseInt(`${result.result_type_id}`)) {
        case 1:
          await this._resultsPolicyChangesRepository.replicable(config);
          break;
        case 2:
          await this._resultsInnovationsUseRepository.replicable(config);
          await this._resultsInnovationsUseMeasuresRepository.replicable(
            config,
          );
          break;
        case 5:
          await this._resultsCapacityDevelopmentsRepository.replicable(config);
          break;
        case 6:
          await this._resultsKnowledgeProductsRepository.replicable(config);
          await this._resultsKnowledgeProductAltmetricRepository.replicable(
            config,
          );
          await this._resultsKnowledgeProductAuthorRepository.replicable(
            config,
          );
          await this._resultsKnowledgeProductKeywordRepository.replicable(
            config,
          );
          await this._resultsKnowledgeProductMetadataRepository.replicable(
            config,
          );
          await this._resultsKnowledgeProductInstitutionRepository.replicable(
            config,
          );
          break;
        case 7:
          await this._resultsInnovationsDevRepository.replicable(config);
          break;
      }

      await this._nonPooledProjectRepository.replicable(config);
      await this._resultsCenterRepository.replicable(config);
      await this._resultsTocResultRepository.replicable(config);
      await this._resultByIntitutionsRepository.replicable(config);
      await this._resultByInstitutionsByDeliveriesTypeRepository.replicable(
        config,
      );
      await this._resultByIntitutionsTypeRepository.replicable(config);
      await this._resultCountryRepository.replicable(config);
      await this._resultRegionRepository.replicable(config);
      await this._linkedResultRepository.replicable(config);
      await this._evidencesRepository.replicable(config);
      //await this._resultsImpactAreaIndicatorRepository.replicable(config);

      this._logger.log(
        `REPORTING: The change of phase of result ${result.id} is completed correctly.`,
      );
      this._logger.log(
        `REPORTING: New result reference in phase [${phase.id}]:${phase.phase_name} is ${data.id}`,
      );
      return data;
    } catch (error) {
      return {
        result: result,
        error: error,
      };
    }
  }

  async $_phaseChangeIPSR(result: Result, phase: Version, user: TokenDto) {}

  async $_versionManagement(
    result: Result,
    phase: Version,
    user: TokenDto,
    module_id: number,
  ) {
    switch (module_id) {
      case 1:
        return await this.$_phaseChangeReporting(result, phase, user);
        break;
      case 2:
        await this.$_phaseChangeIPSR(result, phase, user);
        break;
      default:
        break;
    }
  }

  $_validationModule(result_type_id: number) {
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(result_type_id)) return 1;
    if ([10, 11].includes(result_type_id)) return 2;
    return null;
  }

  async versionProcess(result_id: number, user: TokenDto) {
    try {
      const legacy_result = await this._resultRepository.findOne({
        where: {
          id: result_id,
          is_active: true,
        },
      });

      if (!legacy_result) {
        throw this._returnResponse.format({
          message: `Result ID: ${result_id} not found`,
          response: result_id,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (legacy_result.result_type_id == 6) {
        throw this._returnResponse.format({
          message: `Result ID: ${result_id} is a Knowledge Product, this type of result is not possible to phase shift it contact support`,
          response: result_id,
          statusCode: HttpStatus.CONFLICT,
        });
      }

      const module_id = this.$_validationModule(legacy_result.result_type_id);

      const phase = await this._versionRepository.findOne({
        where: {
          is_active: true,
          status: true,
        },
      });
      let res: any = null;
      if (await this.$_genericValidation(legacy_result.result_code, phase.id)) {
        res = await this.$_versionManagement(
          legacy_result,
          phase,
          user,
          module_id,
        );
        if (res?.error) {
          throw this._returnResponse.format({
            message: `Error in the version process of the result ${legacy_result.id}. Contact with support `,
            response: res.error,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
        
        return this._returnResponse.format({
          message: `The result ${legacy_result.result_code} is in the ${phase.phase_name} phase with id ${res.id}`,
          response: res,
          statusCode: HttpStatus.OK,
        });
      } else {
        throw this._returnResponse.format({
          message: `The result ${legacy_result.result_code} is already in the ${phase.phase_name} phase`,
          response: result_id,
          statusCode: HttpStatus.CONFLICT,
        });
      }
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }

  async findAppModules(): Promise<ReturnResponseDto<ApplicationModules>> {
    try {
      const res = await this._applicationModulesRepository.find({
        where: {
          is_active: true,
        },
      });
      return this._returnResponse.format({
        message: `Application Modules Retrieved Successfully`,
        response: res,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }

  async create(
    user: TokenDto,
    createVersioningDto: CreateVersioningDto,
  ): Promise<ReturnResponseDto<Version>> {
    try {
      const res = await this._versionRepository.findOne({
        where: {
          phase_year: createVersioningDto?.phase_year,
          app_module_id: createVersioningDto.app_module_id,
          is_active: true,
        },
      });

      if (res) {
        throw this._returnResponse.format({
          message: `A phase has already been created for the module ${createVersioningDto?.app_module_id} in the selected year ${createVersioningDto?.phase_year}.`,
          response: createVersioningDto,
          statusCode: HttpStatus.CONFLICT,
        });
      }

      const newPhase = await this._versionRepository.save({
        phase_name: createVersioningDto?.phase_name,
        start_date: createVersioningDto?.start_date,
        end_date: createVersioningDto?.end_date,
        phase_year: createVersioningDto?.phase_year,
        cgspace_year: createVersioningDto?.phase_year,
        toc_pahse_id: createVersioningDto?.toc_pahse_id,
        previous_phase: createVersioningDto?.previous_phase,
        created_by: user.id,
      });

      return this._returnResponse.format({
        message: `Phase ${newPhase.phase_name} created successfully`,
        response: newPhase,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }

  async update(
    id: number,
    updateVersioningDto: UpdateVersioningDto,
  ): Promise<ReturnResponseDto<Version>> {
    try {
      const res = await this._versionRepository.findOne({
        where: {
          id: id,
          is_active: true,
        },
      });

      if (!res) {
        throw this._returnResponse.format({
          message: `Phase ID: ${id} not found`,
          response: id,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (updateVersioningDto?.status) {
        await this._versionRepository.$_closeAllPhases();
      }
      await this._versionRepository.update(id, updateVersioningDto);

      return this._returnResponse.format({
        message: `Phase ${res.phase_name} updated successfully`,
        response: { ...res, ...updateVersioningDto },
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }

  async find(module_type: ModuleTypeEnum, status: StatusPhaseEnum) {
    try {
      let where: any = { is_active: true };

      switch (module_type) {
        case ModuleTypeEnum.REPORTING:
          where = { ...where, app_module_id: 1 };
          break;
        case ModuleTypeEnum.IPSR:
          where = { ...where, app_module_id: 2 };
          break;
      }

      switch (status) {
        case StatusPhaseEnum.OPEN:
          where = { ...where, status: true };
          break;
        case StatusPhaseEnum.CLOSE:
          where = { ...where, status: false };
          break;
      }

      const res = await this._versionRepository.find({
        where: where,
      });

      return this._returnResponse.format({
        message: `Phase Retrieved Successfully`,
        response: res,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }

  async delete(id: number) {
    try {
      const res = await this._versionRepository.findOne({
        where: {
          id: id,
          is_active: true,
        },
      });
      if (!res) {
        throw this._returnResponse.format({
          message: `Phase ID: ${id} not found`,
          response: id,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      return this._returnResponse.format({
        message: `Phase ${res.phase_name} deleted successfully`,
        response: res,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }
}
