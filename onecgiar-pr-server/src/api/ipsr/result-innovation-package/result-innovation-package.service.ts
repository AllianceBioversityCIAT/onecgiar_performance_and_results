import { HttpStatus, Injectable } from '@nestjs/common';
import { HandlersError } from 'src/shared/handlers/error.utils';
import { ResultRepository } from '../../../api/results/result.repository';
import { TokenDto } from '../../../shared/globalInterfaces/token.dto';
import {
  countriesInterface,
  CreateResultInnovationPackageDto,
  UpdateGeneralInformationDto,
} from './dto/create-result-innovation-package.dto';
import { Version } from '../../versioning/entities/version.entity';
import { VersionsService } from '../../../api/results/versions/versions.service';
import { ResultRegion } from '../../../api/results/result-regions/entities/result-region.entity';
import { ResultRegionRepository } from '../../../api/results/result-regions/result-regions.repository';
import { ResultByInitiativesRepository } from '../../../api/results/results_by_inititiatives/resultByInitiatives.repository';
import { ResultCountry } from '../../../api/results/result-countries/entities/result-country.entity';
import { ResultCountryRepository } from '../../../api/results/result-countries/result-countries.repository';
import { IpsrRepository } from '../ipsr.repository';
import { ResultTypeRepository } from 'src/api/results/result_types/resultType.repository';
import { ResultInnovationPackageRepository } from './repositories/result-innovation-package.repository';
import { ResultIpAAOutcomeRepository } from '../innovation-pathway/repository/result-ip-action-area-outcome.repository';
import { ClarisaActionAreaOutcomeRepository } from '../../../clarisa/clarisa-action-area-outcome/clarisa-action-area-outcome.repository';
import { In, IsNull } from 'typeorm';
import { ResultIpAAOutcome } from '../innovation-pathway/entities/result-ip-action-area-outcome.entity';
import { ResultsImpactAreaIndicatorRepository } from 'src/api/results/results-impact-area-indicators/results-impact-area-indicators.repository';
import { ResultIpImpactArea } from '../innovation-pathway/entities/result-ip-impact-area.entity';
import { ResultIpImpactAreaRepository } from '../innovation-pathway/repository/result-ip-impact-area-targets.repository';
import { ActiveBackstoppingRepository } from './repositories/active-backstopping.repository';
import { consensusInitiativeWorkPackageRepository } from './repositories/consensus-initiative-work-package.repository';
import { RegionalIntegratedRepository } from './repositories/regional-integrated.repository';
import { RegionalLeadershipRepository } from './repositories/regional-leadership.repository';
import { RelevantCountryRepository } from './repositories/relevant-country.repository';
import { ResultByEvidencesRepository } from '../../../api/results/results_by_evidences/result_by_evidences.repository';
import { ResultByIntitutionsRepository } from '../../../api/results/results_by_institutions/result_by_intitutions.repository';
import { ResultByIntitutionsTypeRepository } from '../../../api/results/results_by_institution_types/result_by_intitutions_type.repository';
import { resultValidationRepository } from '../../../api/results/results-validation-module/results-validation-module.repository';
import { ResultIpSdgTargetRepository } from '../innovation-pathway/repository/result-ip-sdg-targets.repository';
import { ResultInitiativeBudgetRepository } from '../../../api/results/result_budget/repositories/result_initiative_budget.repository';
import { UnitTimeRepository } from './repositories/unit_time.repository';
import { TocResultsRepository } from '../../../toc/toc-results/toc-results.repository';
import { ResultIpEoiOutcomeRepository } from '../innovation-pathway/repository/result-ip-eoi-outcomes.repository';
import { ResultIpEoiOutcome } from '../innovation-pathway/entities/result-ip-eoi-outcome.entity';
import { TocResult } from '../../../toc/toc-results/entities/toc-result.entity';
import { ResultCountriesSubNationalRepository } from '../../results/result-countries-sub-national/result-countries-sub-national.repository';
import { ResultCountriesSubNational } from '../../results/result-countries-sub-national/entities/result-countries-sub-national.entity';
import { Year } from '../../results/years/entities/year.entity';
import { YearRepository } from '../../results/years/year.repository';
import { LinkedResultRepository } from '../../results/linked-results/linked-results.repository';
import { EvidencesRepository } from '../../results/evidences/evidences.repository';
import { IpsrService } from '../ipsr.service';
import { ResultIpSdgTargets } from '../innovation-pathway/entities/result-ip-sdg-targets.entity';
import { VersioningService } from '../../versioning/versioning.service';
import { AppModuleIdEnum } from '../../../shared/constants/role-type.enum';

@Injectable()
export class ResultInnovationPackageService {
  constructor(
    private readonly _handlersError: HandlersError,
    private readonly _resultRepository: ResultRepository,
    private readonly _versionsService: VersionsService,
    private readonly _resultByInitiativeRepository: ResultByInitiativesRepository,
    private readonly _resultRegionRepository: ResultRegionRepository,
    private readonly _resultCountryRepository: ResultCountryRepository,
    private readonly _innovationByResultRepository: IpsrRepository,
    private readonly _resultInnovationPackageRepository: ResultInnovationPackageRepository,
    private readonly _clarisaAAOutcome: ClarisaActionAreaOutcomeRepository,
    private readonly _resultIpImpactAreaIndicatorsRespository: ResultsImpactAreaIndicatorRepository,
    private readonly _activeBackstoppingRepository: ActiveBackstoppingRepository,
    private readonly _consensusInitiativeWorkPackageRepository: consensusInitiativeWorkPackageRepository,
    private readonly _regionalIntegratedRepository: RegionalIntegratedRepository,
    private readonly _regionalLeadershipRepository: RegionalLeadershipRepository,
    private readonly _relevantCountryRepositor: RelevantCountryRepository,
    private readonly _resultIpImpactAreaRespository: ResultIpImpactAreaRepository,
    private readonly _resultIpAAOutcomeRepository: ResultIpAAOutcomeRepository,
    private readonly _resultIpSdgRespository: ResultIpSdgTargetRepository,
    private readonly _resultByEvidencesRepository: ResultByEvidencesRepository,
    private readonly _resultByIntitutionsRepository: ResultByIntitutionsRepository,
    private readonly _resultByIntitutionsTypeRepository: ResultByIntitutionsTypeRepository,
    private readonly _resultValidationRepository: resultValidationRepository,
    private readonly _resultInitiativesBudgetRepository: ResultInitiativeBudgetRepository,
    private readonly _unitTimeRepository: UnitTimeRepository,
    private readonly _tocResult: TocResultsRepository,
    private readonly _resultCountriesSubNationalRepository: ResultCountriesSubNationalRepository,
    private readonly _yearRepository: YearRepository,
    private readonly _linkedResultRepository: LinkedResultRepository,
    private readonly _evidenceRepository: EvidencesRepository,
    private readonly _ipsrService: IpsrService,
    private readonly _versioningService: VersioningService,
  ) {}

  async findUnitTime() {
    try {
      const unit_time = await this._unitTimeRepository.find();
      return {
        response: unit_time,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findRelevantCountry() {
    try {
      const request = await this._relevantCountryRepositor.find();
      return {
        response: request,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findRegionalLeadership() {
    try {
      const request = await this._regionalLeadershipRepository.find();
      return {
        response: request,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findRegionalIntegrated() {
    try {
      const request = await this._regionalIntegratedRepository.find();
      return {
        response: request,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findConsensusInitiativeWorkPackage() {
    try {
      const request =
        await this._consensusInitiativeWorkPackageRepository.find();
      return {
        response: request,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findActiveBackstopping() {
    try {
      const request = await this._activeBackstoppingRepository.find();
      return {
        response: request,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async createHeader(
    CreateResultInnovationPackageDto: CreateResultInnovationPackageDto,
    user: TokenDto,
  ) {
    try {
      let innovationTitle: string;
      let innovationGeoScope: number;

      const coreInnovationResult = await this._resultRepository.getResultById(
        CreateResultInnovationPackageDto.result_id,
      );

      if (!coreInnovationResult) {
        throw {
          response: coreInnovationResult,
          message: 'The result was not found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const coreInnovationInitiative =
        await this._resultByInitiativeRepository.findOne({
          where: {
            result_id: CreateResultInnovationPackageDto.result_id,
            initiative_role_id: 1,
            is_active: true,
          },
        });

      if (!coreInnovationInitiative) {
        throw {
          response: coreInnovationInitiative,
          message: 'An error occurred while creating the Innovation Package',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const initiativeRole =
        await this._resultByInitiativeRepository.InitiativeByResult(
          +coreInnovationResult.id,
        );
      const mapInits = initiativeRole.find(
        (i) =>
          i.inititiative_id === CreateResultInnovationPackageDto.initiative_id,
      );

      if (!mapInits) {
        return {
          response: mapInits,
          message:
            'If your initiative is not primary or does not contribute to the Core Innovation, you cannot create an Innovatio Package with the result.',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      if (!CreateResultInnovationPackageDto.initiative_id) {
        throw {
          response: `Initiative id: ${CreateResultInnovationPackageDto.initiative_id}`,
          message:
            'Please enter a Initiative Official Code to create a new Innovation Package',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      if (!CreateResultInnovationPackageDto.geo_scope_id) {
        throw {
          response: `Geo Scope id: ${CreateResultInnovationPackageDto.geo_scope_id}`,
          message:
            'Please enter a Geo Scope to create a new Innovation Package',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const version = await this._versioningService.$_findActivePhase(
        AppModuleIdEnum.IPSR,
      );
      console.log('esto esta bien?', version);
      if (!version) {
        throw this._handlersError.returnErrorRes({
          error: `No phase is open for the IPSR module`,
          debug: true,
        });
      }

      const result = coreInnovationResult;
      if (result.result_type_id != 7) {
        throw {
          response: result.result_type_id,
          message:
            'This is not a valid result type. Only Innovation Develpments can be used to create a new Innovation Package.',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const last_code = await this._resultRepository.getLastResultCode();
      const regions = CreateResultInnovationPackageDto.regions;
      const countries = CreateResultInnovationPackageDto.countries;
      console.log('aun esta bien!');

      if ([1, 2, 5].includes(CreateResultInnovationPackageDto.geo_scope_id)) {
        innovationGeoScope = CreateResultInnovationPackageDto.geo_scope_id;
      } else {
        innovationGeoScope = countries?.length > 1 ? 3 : 4;
      }

      if (CreateResultInnovationPackageDto.geo_scope_id === 2) {
        const regionsList = regions.map((r) => r.name);
        if (result.title.endsWith('.')) {
          result.title = result.title.replace(/\.$/, '');
        }
        innovationTitle = `Innovation Package and Scaling Readiness assessment for ${
          result.title
        } in ${regionsList.slice(0, -1).join(', ')}${
          regionsList.length > 1 ? ' and ' : ''
        }${regionsList[regionsList.length - 1]}`;
      } else if (
        CreateResultInnovationPackageDto.geo_scope_id === 3 ||
        CreateResultInnovationPackageDto.geo_scope_id === 4
      ) {
        const countriesList = countries.map((c) => c.name);
        if (result.title.endsWith('.')) {
          result.title = result.title.replace(/\.$/, '');
        }
        innovationTitle = `Innovation Package and Scaling Readiness assessment for ${result.title.toLocaleLowerCase()} in ${countriesList
          .slice(0, -1)
          .join(', ')}${countriesList.length > 1 ? ' and ' : ''}${
          countriesList[countriesList.length - 1]
        }`;
      } else if (CreateResultInnovationPackageDto.geo_scope_id === 5) {
        const countriesList = countries.map((c) => c.name);
        if (result.title.endsWith('.')) {
          result.title = result.title.replace(/\.$/, '');
        }
        innovationTitle = `Innovation Package and Scaling Readiness assessment for ${result.title.toLocaleLowerCase()} in ${countriesList
          .slice(0, -1)
          .join(', ')}${countriesList.length > 1 ? ' and ' : ''}${
          countriesList[countriesList.length - 1]
        }`;
      } else {
        if (result.title.endsWith('.')) {
          result.title = result.title.replace(/\.$/, '');
        }
        innovationTitle = `Innovation Package and Scaling Readiness assessment for ${result.title.toLocaleLowerCase()}.`;
      }

      const titleValidate = await this._resultRepository
        .createQueryBuilder('result')
        .where('result.title like :title AND is_active = true', {
          title: `${innovationTitle}`,
        })
        .getMany();

      if (titleValidate.length) {
        throw {
          response: titleValidate.map((tv) => tv.id),
          message: `The title already exists, in the following result: ${titleValidate.map(
            (tv) => tv.result_code,
          )}. Please change the Regions or Countries.`,
          status: HttpStatus.BAD_REQUEST,
        };
      }
      const year: Year = await this._yearRepository.findOne({
        where: { active: true },
      });

      if (!year) {
        throw {
          response: {},
          message: 'Active year Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const newInnovationHeader = await this._resultRepository.save({
        result_code: last_code + 1,
        title: innovationTitle,
        description: result.description,
        gender_tag_level_id: result.gender_tag_level_id,
        climate_change_tag_level_id: result.climate_change_tag_level_id,
        lead_contact_person: result.lead_contact_person,
        reported_year_id: year.year,
        result_level_id: 3,
        result_type_id: 10,
        has_regions: regions ? true : false,
        has_countries: countries ? true : false,
        geographic_scope_id: innovationGeoScope,
        initiative_id: CreateResultInnovationPackageDto.initiative_id,
        version_id: version.id,
        created_by: user.id,
        last_updated_by: user.id,
      });

      const newResult = newInnovationHeader.id;
      const newInnovationByInitiative =
        await this._resultByInitiativeRepository.save({
          result_id: newResult,
          initiative_id: CreateResultInnovationPackageDto.initiative_id,
          initiative_role_id: 1,
          created_by: user.id,
          last_updated_by: user.id,
        });

      const resultByInitiativesId = newInnovationByInitiative.id;
      const newresultInitiativeBudget =
        await this._resultInitiativesBudgetRepository.save({
          result_initiative_id: resultByInitiativesId,
          created_by: user.id,
          last_updated_by: user.id,
        });

      const newResultInnovationPackage =
        await this._resultInnovationPackageRepository.save({
          result_innovation_package_id: newResult,
          created_by: user.id,
          last_updated_by: user.id,
        });

      const newInnovationByResult =
        await this._innovationByResultRepository.save({
          result_innovation_package_id: newResult,
          result_id: result.id,
          ipsr_role_id: 1,
          created_by: user.id,
          last_updated_by: user.id,
        });
      const resultByInnivationPackage =
        newInnovationByResult.result_by_innovation_package_id;

      const linkedResult = await this._linkedResultRepository.save({
        linked_results_id: result.id,
        origin_result_id: newResult,
        created_by: user.id,
        last_updated_by: user.id,
      });

      let resultRegions: ResultRegion[] = [];
      let newInnovationCountries: ResultCountry[] = [];

      if (CreateResultInnovationPackageDto.geo_scope_id === 2) {
        if (regions) {
          for (let i = 0; i < regions.length; i++) {
            const newRegions = new ResultRegion();
            newRegions.result_id = newResult;
            newRegions.region_id = regions[i].id;
            newRegions.is_active = true;
            resultRegions.push(newRegions);
          }
        }
      } else if (
        CreateResultInnovationPackageDto.geo_scope_id === 3 ||
        CreateResultInnovationPackageDto.geo_scope_id === 4 ||
        CreateResultInnovationPackageDto.geo_scope_id === 5
      ) {
        if (countries) {
          for (const ct of countries) {
            const newRc = await this._resultCountryRepository.save({
              result_id: newResult,
              country_id: ct.id,
            });
            newInnovationCountries.push(newRc);
            if (
              CreateResultInnovationPackageDto.geo_scope_id === 5 &&
              ct?.result_countries_sub_national?.length
            ) {
              await this.saveSubNational(
                newRc.result_country_id,
                ct.result_countries_sub_national,
                user,
                version,
              );
            }
          }
        }
      }
      const newInnovationRegions = await this._resultRegionRepository.save(
        resultRegions,
      );

      const retriveAAOutcome = await this.retrievedAAOutcome(
        result.id,
        coreInnovationInitiative.initiative_id,
        user.id,
        resultByInnivationPackage,
        version.id,
      );

      const retrievedImpactArea = await this.retrievedImpactArea(
        result.id,
        coreInnovationInitiative.initiative_id,
        user.id,
        resultByInnivationPackage,
        version.id,
      );

      const retrieveSdgs = await this.retrievedSdgs(
        result.id,
        coreInnovationInitiative.initiative_id,
        user.id,
        resultByInnivationPackage,
        version.id,
      );

      return {
        response: {
          newInnovationHeader,
          retriveAAOutcome,
          retrievedImpactArea,
          retrieveSdgs,
          newInnovationByInitiative,
          newresultInitiativeBudget,
          newResultInnovationPackage,
          newInnovationByResult,
          linkedResult,
          newInnovationRegions,
          newInnovationCountries,
        },
        message: 'Successfully created',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async saveSubNational(
    reCoId: number,
    subNationals: ResultCountriesSubNational[],
    user: TokenDto,
    v: Version,
  ) {
    if (subNationals?.length) {
      subNationals.forEach(async (el) => {
        let reCoSub: ResultCountriesSubNational = null;
        const whereConditions = el?.result_countries_sub_national_id
          ? {
              result_countries_sub_national_id:
                el.result_countries_sub_national_id,
            }
          : el?.sub_level_one_id && el?.sub_level_two_id
          ? {
              sub_level_one_id: el.sub_level_one_id,
              sub_level_two_id: el.sub_level_two_id,
              result_countries_id: reCoId,
            }
          : !reCoId && el?.sub_level_one_id && !el?.sub_level_two_id
          ? {
              sub_level_one_id: el.sub_level_one_id,
              sub_level_two_id: IsNull(),
              result_countries_id: reCoId,
            }
          : !reCoId && !el?.sub_level_one_id && !el?.sub_level_two_id
          ? {
              sub_level_one_id: IsNull(),
              sub_level_two_id: IsNull(),
              result_countries_id: reCoId,
            }
          : null;

        if (whereConditions) {
          reCoSub = await this._resultCountriesSubNationalRepository.findOne({
            where: whereConditions,
          });
        }

        if (reCoSub) {
          await this._resultCountriesSubNationalRepository.update(
            reCoSub.result_countries_sub_national_id,
            {
              is_active: el?.is_active == undefined ? true : el.is_active,
              sub_level_one_id: el?.sub_level_one_id,
              sub_level_one_name: el?.sub_level_one_name,
              sub_level_two_id: el?.sub_level_two_id,
              sub_level_two_name: el?.sub_level_two_name,
              last_updated_by: user.id,
            },
          );
        } else {
          await this._resultCountriesSubNationalRepository.save({
            created_by: user.id,
            last_updated_by: user.id,
            sub_level_one_id: el?.sub_level_one_id,
            sub_level_two_id: el?.sub_level_two_id,
            sub_level_one_name: el?.sub_level_one_name,
            sub_level_two_name: el?.sub_level_two_name,
            result_countries_id: reCoId,
          });
        }
      });
    }
  }

  async defaultRelevantCountry(geoscope: number, resultId: number) {
    if ([1, 2, 3, 4].includes(geoscope)) {
      if ([1, 2].includes(geoscope)) {
        return 3;
      }
      if ([3, 4].includes(geoscope)) {
        const rc = await this._resultCountryRepository.findOne({
          where: { result_id: resultId, is_active: true },
        });
        return rc ? 3 : null;
      }
    }
    return null;
  }

  async retrievedAAOutcome(
    coreId: number,
    initId: number,
    user: number,
    resultByIpId: number,
    version: number,
  ) {
    try {
      let saveAAOutcome: any;
      const searchTocData =
        await this._resultIpAAOutcomeRepository.mapActionAreaOutcome(
          coreId,
          initId,
        );
      const smoAAOutcomeToc = searchTocData.map((stc) => stc.outcome_smo_code);
      const mapAAOutcome = await this._clarisaAAOutcome.find({
        where: { outcomeSMOcode: In(smoAAOutcomeToc) },
      });

      for (const data of mapAAOutcome) {
        const newAAOutcome = new ResultIpAAOutcome();
        newAAOutcome.action_area_outcome_id = data.id;
        newAAOutcome.result_by_innovation_package_id = resultByIpId;
        newAAOutcome.created_by = user;
        newAAOutcome.last_updated_by = user;
        newAAOutcome.created_date = new Date();
        newAAOutcome.last_updated_date = new Date();
        saveAAOutcome = await this._resultIpAAOutcomeRepository.save(
          newAAOutcome,
        );
      }
      return {
        response: {
          saveAAOutcome,
        },
        message: 'Successfully created',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async retrievedImpactArea(
    coreId: number,
    initId: number,
    user: number,
    resultByIpId: number,
    version: number,
  ) {
    try {
      let saveImpactArea: any;
      const searchTocData =
        await this._resultIpImpactAreaIndicatorsRespository.mapImpactAreaOutcomeToc(
          coreId,
          initId,
        );

      for (const data of searchTocData) {
        const newImpactArea = new ResultIpImpactArea();
        newImpactArea.impact_area_indicator_id = data.impact_area_indicator_id;
        newImpactArea.result_by_innovation_package_id = resultByIpId;
        newImpactArea.created_by = user;
        newImpactArea.last_updated_by = user;
        newImpactArea.created_date = new Date();
        newImpactArea.last_updated_date = new Date();
        saveImpactArea = await this._resultIpImpactAreaRespository.save(
          newImpactArea,
        );
      }

      return {
        response: saveImpactArea,
        message: 'Successfully created',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async retrievedSdgs(
    coreId: number,
    initId: number,
    user: number,
    resultByIpId: number,
    version: number,
  ) {
    try {
      let saveSdgs: any;
      const searchTocData = await this._resultIpSdgRespository.mapSdgsToc(
        coreId,
        initId,
      );

      for (const data of searchTocData) {
        const newSdg = new ResultIpSdgTargets();
        newSdg.clarisa_sdg_target_id = data.clarisa_sdg_target_id;
        newSdg.clarisa_sdg_usnd_code = data.clarisa_sdg_usnd_code;
        newSdg.result_by_innovation_package_id = resultByIpId;
        newSdg.created_by = user;
        newSdg.last_updated_by = user;
        newSdg.created_date = new Date();
        newSdg.last_updated_date = new Date();
        saveSdgs = await this._resultIpSdgRespository.save(newSdg);
      }

      return {
        response: saveSdgs,
        message: 'Successfully created',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async generalInformation(
    resultId: number,
    updateGeneralInformationDto: UpdateGeneralInformationDto,
    user: TokenDto,
  ) {
    try {
      const resultExist = await this._resultRepository.findOneBy({
        id: resultId,
      });
      const req = updateGeneralInformationDto;

      const version = await this._versioningService.$_findActivePhase(
        AppModuleIdEnum.IPSR,
      );
      if (!version) {
        throw this._handlersError.returnErrorRes({
          error: version,
          debug: true,
        });
      }

      const titleValidate = await this._resultRepository
        .createQueryBuilder('result')
        .where('result.title like :title', { title: `${req.title}` })
        .andWhere('result.is_active = 1')
        .getMany();

      if (titleValidate.length > 1) {
        if (!titleValidate.find((tv) => tv.id === resultId)) {
          throw {
            response: titleValidate.map((tv) => tv.id),
            message: `The title already exists, in the following results: ${titleValidate.map(
              (tv) => tv.result_code,
            )}`,
            status: HttpStatus.BAD_REQUEST,
          };
        }
      }

      await this._resultRepository.update(resultId, {
        title: req?.title,
        description: req?.description,
        lead_contact_person: req?.lead_contact_person,
        gender_tag_level_id: req?.gender_tag_level_id,
        climate_change_tag_level_id: req?.climate_change_tag_level_id,
        is_krs: req?.is_krs,
        krs_url: req?.krs_url,
        geographic_scope_id: resultExist.geographic_scope_id,
        last_updated_by: user.id,
      });

      const genderEvidenceExist = await this._evidenceRepository.findOne({
        where: {
          result_id: resultId,
          is_active: 1,
          gender_related: true,
        },
      });

      if (req?.evidence_gender_tag) {
        if (genderEvidenceExist) {
          await this._evidenceRepository.update(genderEvidenceExist.id, {
            link: req?.evidence_gender_tag,
            last_updated_by: user.id,
            gender_related: true,
          });
        } else {
          await this._evidenceRepository.save({
            result_id: resultId,
            link: req?.evidence_gender_tag,
            created_by: user.id,
            last_updated_by: user.id,
            gender_related: true,
          });
        }
      }

      const climateEvidenceExist = await this._evidenceRepository.findOne({
        where: {
          result_id: resultId,
          is_active: 1,
          youth_related: true,
        },
      });

      if (req?.evidence_climate_tag) {
        if (climateEvidenceExist) {
          await this._evidenceRepository.update(climateEvidenceExist.id, {
            link: req?.evidence_climate_tag,
            last_updated_by: user.id,
            youth_related: true,
          });
        } else {
          await this._evidenceRepository.save({
            result_id: resultId,
            link: req?.evidence_climate_tag,
            created_by: user.id,
            last_updated_by: user.id,
            youth_related: true,
          });
        }
      }

      const { response } = await this._ipsrService.findOneInnovation(resultId);

      return {
        response: response,
        message: 'Successfully updated',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async delete(resultId: number, user: TokenDto) {
    const resultToUpdate = await this._resultRepository.find({
      where: { id: resultId },
    });

    if (!resultToUpdate) {
      return {
        response: { valid: false },
        message: 'The result was not found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const resultByInnovationPackageToUpdate =
      await this._innovationByResultRepository.find({
        where: { result_innovation_package_id: resultId, is_active: true },
      });

    const id = resultToUpdate[0].id;
    const result_by_innovation_package_id =
      resultByInnovationPackageToUpdate[0].result_by_innovation_package_id;

    const result = await this._resultRepository.update(id, {
      is_active: false,
      last_updated_date: new Date(),
      last_updated_by: user.id,
    });
    const regions = await this._resultRegionRepository.update(id, {
      is_active: false,
      last_updated_date: new Date(),
    });
    const countries = await this._resultCountryRepository.update(id, {
      is_active: false,
      last_updated_date: new Date(),
    });
    const resultByInit = await this._resultByInitiativeRepository.update(id, {
      is_active: false,
      last_updated_date: new Date(),
      last_updated_by: user.id,
    });
    const resultByInnoPackage = await this._innovationByResultRepository.update(
      id,
      {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      },
    );
    const resultInnoPackage =
      await this._resultInnovationPackageRepository.update(
        { result_innovation_package_id: id },
        {
          is_active: false,
          last_updated_date: new Date(),
          last_updated_by: user.id,
        },
      );
    const resultByInstitutionsType =
      await this._resultByIntitutionsTypeRepository.update(id, {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      });
    const resultBInstitutions =
      await this._resultByIntitutionsRepository.update(id, {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      });
    const resultByevidencce = await this._resultByEvidencesRepository.update(
      id,
      {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      },
    );
    const resultValidattion = await this._resultValidationRepository.update(
      id,
      { is_active: false, last_updated_date: new Date() },
    );
    const resultIpAAOutcome = await this._resultIpAAOutcomeRepository.update(
      result_by_innovation_package_id,
      {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      },
    );
    const resultIpImpactArea = await this._resultIpImpactAreaRespository.update(
      result_by_innovation_package_id,
      {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      },
    );
    const resultIpSdg = await this._resultIpSdgRespository.update(
      result_by_innovation_package_id,
      {
        is_active: false,
        last_updated_date: new Date(),
        last_updated_by: user.id,
      },
    );

    return {
      response: {
        result,
        regions,
        countries,
        resultByInit,
        resultByInnoPackage,
        resultInnoPackage,
        resultByInstitutionsType,
        resultBInstitutions,
        resultByevidencce,
        resultValidattion,
        resultIpAAOutcome,
        resultIpImpactArea,
        resultIpSdg,
      },
      message: 'The result was deleted successfully',
      status: HttpStatus.ACCEPTED,
    };
  }
}
