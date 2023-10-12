import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
} from 'typeorm';
import { TokenDto } from '../../../shared/globalInterfaces/token.dto';
import {
  HandlersError,
  returnErrorDto,
} from '../../../shared/handlers/error.utils';
import { MQAPResultDto } from '../../m-qap/dtos/m-qap.dto';
import { MQAPService } from '../../m-qap/m-qap.service';
import { Result } from '../entities/result.entity';
import { ResultRepository } from '../result.repository';
import { Version } from '../../versioning/entities/version.entity';
import { ResultsKnowledgeProduct } from './entities/results-knowledge-product.entity';
import { ResultsKnowledgeProductMapper } from './results-knowledge-products.mapper';
import { ResultsKnowledgeProductsRepository } from './repositories/results-knowledge-products.repository';
import { ResultsKnowledgeProductAltmetricRepository } from './repositories/results-knowledge-product-altmetrics.repository';
import { ResultsKnowledgeProductAuthorRepository } from './repositories/results-knowledge-product-authors.repository';
import { ResultsKnowledgeProductInstitutionRepository } from './repositories/results-knowledge-product-institution.repository';
import { ResultsKnowledgeProductKeywordRepository } from './repositories/results-knowledge-product-keywords.repository';
import { ResultsKnowledgeProductMetadataRepository } from './repositories/results-knowledge-product-metadata.repository';
import { ResultsKnowledgeProductDto } from './dto/results-knowledge-product.dto';
import { returnFormatResult } from '../dto/return-format-result.dto';
import { ModuleRef } from '@nestjs/core';
import { CreateResultDto } from '../dto/create-result.dto';
import { ClarisaInitiativesRepository } from '../../../clarisa/clarisa-initiatives/ClarisaInitiatives.repository';
import { ResultByLevelRepository } from '../result-by-level/result-by-level.repository';
import { ResultLevelRepository } from '../result_levels/resultLevel.repository';
import { ResultTypesService } from '../result_types/result_types.service';
import { ResultLevel } from '../result_levels/entities/result_level.entity';
import { ResultType } from '../result_types/entities/result_type.entity';
import { Year } from '../years/entities/year.entity';
import { YearRepository } from '../years/year.repository';
import { ResultByInitiativesRepository } from '../results_by_inititiatives/resultByInitiatives.repository';
import { ResultTypeRepository } from '../result_types/resultType.repository';
import { EvidencesRepository } from '../evidences/evidences.repository';
import { ResultsKnowledgeProductMetadataDto } from './dto/results-knowledge-product-metadata.dto';
import { ResultsKnowledgeProductSaveDto } from './dto/results-knowledge-product-save.dto';
import { KnowledgeProductFairBaseline } from '../knowledge_product_fair_baseline/entities/knowledge_product_fair_baseline.entity';
import { KnowledgeProductFairBaselineRepository } from '../knowledge_product_fair_baseline/knowledge_product_fair_baseline.repository';
import { RoleByUserRepository } from '../../../auth/modules/role-by-user/RoleByUser.repository';
import { ResultRegionRepository } from '../result-regions/result-regions.repository';
import { ClarisaRegionsRepository } from '../../../clarisa/clarisa-regions/ClariasaRegions.repository';
import { ClarisaRegion } from '../../../clarisa/clarisa-regions/entities/clarisa-region.entity';
import { ResultRegion } from '../result-regions/entities/result-region.entity';
import { CGSpaceCountryMappingsRepository } from './repositories/cgspace-country-mappings.repository';
import { ResultCountry } from '../result-countries/entities/result-country.entity';
import { ResultCountryRepository } from '../result-countries/result-countries.repository';
import { VersioningService } from '../../versioning/versioning.service';
import { AppModuleIdEnum } from '../../../shared/constants/role-type.enum';
import { ClarisaCountriesRepository } from '../../../clarisa/clarisa-countries/ClarisaCountries.repository';
import { ResultsKnowledgeProductFairScore } from './entities/results-knowledge-product-fair-scores.entity';
import { FairField } from './entities/fair-fields.entity';
import { FairFieldRepository } from './repositories/fair-fields.repository';
import { FairFieldEnum } from './entities/fair-fields.enum';
import { FairSpecificData, FullFairData } from './dto/fair-data.dto';
import { ResultsKnowledgeProductFairScoreRepository } from './repositories/results-knowledge-product-fair-scores.repository';
import { ResultsCenterRepository } from '../results-centers/results-centers.repository';
import { ClarisaInstitutionsRepository } from '../../../clarisa/clarisa-institutions/ClariasaInstitutions.repository';
import { ResultsCenter } from '../results-centers/entities/results-center.entity';

@Injectable()
export class ResultsKnowledgeProductsService {
  private readonly _resultsKnowledgeProductRelations: FindOptionsRelations<ResultsKnowledgeProduct> =
    {
      result_knowledge_product_altmetric_array: true,
      result_knowledge_product_institution_array: {
        results_by_institutions_object: true,
        predicted_institution_object: {
          clarisa_center: true,
        },
      },
      result_knowledge_product_metadata_array: true,
      result_knowledge_product_keyword_array: true,
      result_knowledge_product_author_array: true,
      result_object: {
        result_region_array: {
          region_object: true,
        },
        result_country_array: {
          country_object: {
            cgspace_country_mapping_array: true,
          },
        },
        obj_version: true,
      },
      result_knowledge_product_fair_score_array: {
        fair_field_object: {
          parent_object: true,
        },
      },
    };

  constructor(
    private readonly _resultsKnowledgeProductRepository: ResultsKnowledgeProductsRepository,
    private readonly _handlersError: HandlersError,
    private readonly _resultRepository: ResultRepository,
    private readonly _mqapService: MQAPService,
    private readonly _resultsKnowledgeProductMapper: ResultsKnowledgeProductMapper,
    private readonly _resultsKnowledgeProductAltmetricRepository: ResultsKnowledgeProductAltmetricRepository,
    private readonly _resultsKnowledgeProductAuthorRepository: ResultsKnowledgeProductAuthorRepository,
    private readonly _resultsKnowledgeProductInstitutionRepository: ResultsKnowledgeProductInstitutionRepository,
    private readonly _resultsKnowledgeProductKeywordRepository: ResultsKnowledgeProductKeywordRepository,
    private readonly _resultsKnowledgeProductMetadataRepository: ResultsKnowledgeProductMetadataRepository,
    private readonly _evidenceRepository: EvidencesRepository,
    private readonly _clarisaInitiativesRepository: ClarisaInitiativesRepository,
    private readonly _resultByLevelRepository: ResultByLevelRepository,
    private readonly _resultLevelRepository: ResultLevelRepository,
    private readonly _resultTypeRepository: ResultTypeRepository,
    private readonly _roleByUseRepository: RoleByUserRepository,
    private readonly _resultByInitiativesRepository: ResultByInitiativesRepository,
    private readonly _resultRegionRepository: ResultRegionRepository,
    private readonly _knowledgeProductFairBaselineRepository: KnowledgeProductFairBaselineRepository,
    private readonly _clarisaRegionsRepository: ClarisaRegionsRepository,
    private readonly _clarisaCountriesRepository: ClarisaCountriesRepository,
    private readonly _resultCountryRepository: ResultCountryRepository,
    private readonly _versioningService: VersioningService,
    private readonly _fairFieldRepository: FairFieldRepository,
    private readonly _resultsKnowledgeProductFairScoreRepository: ResultsKnowledgeProductFairScoreRepository,
    private readonly _resultCenterRepository: ResultsCenterRepository,
    private readonly _clarisaInstitutionRepository: ClarisaInstitutionsRepository,
  ) {}

  private async createOwnerResult(
    createResultDto: CreateResultDto,
    user: TokenDto,
  ): Promise<returnFormatResult | returnErrorDto> {
    try {
      if (
        !createResultDto?.result_name ||
        !createResultDto?.initiative_id ||
        !createResultDto?.result_type_id ||
        !createResultDto?.result_level_id
      ) {
        throw {
          response: {},
          message: 'missing data: Result name, Initiative or Result type',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const initiative = await this._clarisaInitiativesRepository.findOne({
        where: { id: createResultDto.initiative_id },
      });
      if (!initiative) {
        throw {
          response: {},
          message: 'Initiative Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const resultByLevel =
        await this._resultByLevelRepository.getByTypeAndLevel(
          createResultDto.result_level_id,
          createResultDto.result_type_id,
        );
      const resultLevel = await this._resultLevelRepository.findOne({
        where: { id: createResultDto.result_level_id },
      });
      const resultType = await this._resultTypeRepository.findOneBy({
        id: createResultDto.result_type_id,
      });
      if (!resultLevel) {
        throw {
          response: {},
          message: 'Result Level not found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      if (!resultByLevel) {
        throw {
          response: {},
          message: 'The type or level is not compatible',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const rl: ResultLevel = <ResultLevel>resultLevel;

      const currentVersion: Version =
        await this._versioningService.$_findActivePhase(
          AppModuleIdEnum.REPORTING,
        );

      if (!currentVersion) {
        throw {
          response: {},
          message: 'Current Version Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const last_code = await this._resultRepository.getLastResultCode();
      const newResultHeader: Result = await this._resultRepository.save({
        created_by: user.id,
        last_updated_by: user.id,
        result_type_id: resultType.id,
        version_id: currentVersion.id,
        title: createResultDto.result_name,
        reported_year_id: currentVersion.phase_year,
        result_level_id: rl.id,
        result_code: last_code + 1,
      });

      await this._resultByInitiativesRepository.save({
        created_by: newResultHeader.created_by,
        initiative_id: initiative.id,
        initiative_role_id: 1,
        result_id: newResultHeader.id,
      });

      return {
        response: newResultHeader,
        message: 'The Result has been created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async syncAgain(resultId: number, user: TokenDto) {
    try {
      const resultKnowledgeProduct: ResultsKnowledgeProduct =
        await this._resultsKnowledgeProductRepository.findOne({
          where: {
            results_id: resultId,
          },
          relations: this._resultsKnowledgeProductRelations,
        });

      if (!resultKnowledgeProduct) {
        return {
          response: { title: resultKnowledgeProduct.name },
          message: `A Result Knowledge Product with result_id '${resultId}' does not exist.`,
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const isAdmin: any = await this._roleByUseRepository.isUserAdmin(user.id);

      if (isAdmin?.is_admin == false) {
        if (
          resultKnowledgeProduct.knowledge_product_type == 'Journal Article'
        ) {
          throw {
            response: {},
            message: `The Result with id ${resultId} cannot be manually updated right now`,
            status: HttpStatus.PRECONDITION_FAILED,
          };
        }
      }

      const cgspaceResponse = await this.findOnCGSpace(
        resultKnowledgeProduct.handle,
        resultKnowledgeProduct.result_object?.obj_version?.cgspace_year,
        false,
      );

      if (cgspaceResponse.status !== HttpStatus.OK) {
        throw this._handlersError.returnErrorRes({ error: cgspaceResponse });
      }

      const newMetadata =
        cgspaceResponse.response as ResultsKnowledgeProductDto;

      let updatedKnowledgeProduct =
        this._resultsKnowledgeProductMapper.updateEntity(
          resultKnowledgeProduct,
          newMetadata,
          user.id,
          resultKnowledgeProduct.results_id,
        );

      updatedKnowledgeProduct.result_knowledge_product_id =
        resultKnowledgeProduct.result_knowledge_product_id;

      this._resultsKnowledgeProductMapper.patchAltmetricData(
        updatedKnowledgeProduct,
        newMetadata,
        true,
      );
      this._resultsKnowledgeProductMapper.patchAuthors(
        updatedKnowledgeProduct,
        newMetadata,
        true,
      );
      this._resultsKnowledgeProductMapper.patchInstitutions(
        updatedKnowledgeProduct,
        newMetadata,
        true,
      );
      this._resultsKnowledgeProductMapper.patchKeywords(
        updatedKnowledgeProduct,
        newMetadata,
        true,
      );
      this._resultsKnowledgeProductMapper.patchMetadata(
        updatedKnowledgeProduct,
        newMetadata,
        true,
      );
      this._resultsKnowledgeProductMapper.patchRegions(
        updatedKnowledgeProduct,
        newMetadata,
        true,
      );

      updatedKnowledgeProduct =
        await this._resultsKnowledgeProductRepository.save(
          updatedKnowledgeProduct,
        );

      //updating general result tables
      await this._resultRepository.update(
        { id: resultId },
        {
          title: newMetadata.title,
          description: newMetadata.description,
        },
      );

      await this.separateCentersFromCgspacePartners(
        updatedKnowledgeProduct,
        true,
      );

      //updating relations
      await this._resultsKnowledgeProductAltmetricRepository.save(
        updatedKnowledgeProduct.result_knowledge_product_altmetric_array ?? [],
      );
      await this._resultsKnowledgeProductAuthorRepository.save(
        updatedKnowledgeProduct.result_knowledge_product_author_array ?? [],
      );
      await this._resultsKnowledgeProductInstitutionRepository.save(
        updatedKnowledgeProduct.result_knowledge_product_institution_array ??
          {},
      );
      await this._resultsKnowledgeProductKeywordRepository.save(
        updatedKnowledgeProduct.result_knowledge_product_keyword_array ?? [],
      );
      await this._resultsKnowledgeProductMetadataRepository.save(
        updatedKnowledgeProduct.result_knowledge_product_metadata_array ?? [],
      );

      //geolocation
      await this.updateCountries(updatedKnowledgeProduct, newMetadata, true);
      await this._resultCountryRepository.save(
        updatedKnowledgeProduct.result_object.result_country_array ?? [],
      );

      await this.updateGeoLocation(
        updatedKnowledgeProduct.result_object,
        updatedKnowledgeProduct,
        newMetadata,
      );

      await this._resultRegionRepository.save(
        updatedKnowledgeProduct.result_object.result_region_array ?? [],
      );

      //fair
      await this.updateFair(updatedKnowledgeProduct, newMetadata, true);
      await this._resultsKnowledgeProductFairScoreRepository.save(
        updatedKnowledgeProduct.result_knowledge_product_fair_score_array ?? [],
      );

      return {
        response: updatedKnowledgeProduct,
        message: 'The Result Knowledge Product has been updated successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async updateFair(
    knowledgeProduct: ResultsKnowledgeProduct,
    resultsKnowledgeProductDto: ResultsKnowledgeProductDto,
    upsert = false,
  ) {
    const allFairFields: FairField[] = await this._fairFieldRepository.find({
      where: { is_active: true },
      relations: { parent_object: true, children_array: true },
    });
    let updatedFields: ResultsKnowledgeProductFairScore[] = [];

    for (const field of Object.values(FairFieldEnum)) {
      const currentFairFieldIndex: number = (
        knowledgeProduct.result_knowledge_product_fair_score_array ?? []
      ).findIndex(
        (fs) =>
          fs.fair_field_object.short_name == field && fs.is_baseline == false,
      );

      const currentFairFieldObject: ResultsKnowledgeProductFairScore =
        currentFairFieldIndex < 0
          ? new ResultsKnowledgeProductFairScore()
          : (knowledgeProduct.result_knowledge_product_fair_score_array ?? [])[
              currentFairFieldIndex
            ];

      if (!currentFairFieldObject.fair_field_id) {
        currentFairFieldObject.fair_field_id = allFairFields.find(
          (ff) => ff.short_name == field,
        )?.fair_field_id;
        currentFairFieldObject.result_knowledge_product_id =
          knowledgeProduct.result_knowledge_product_id;
      }

      let valuePath: string;
      let currentFairField: FairField = allFairFields.find(
        (ff) => ff.short_name == field,
      );
      while (currentFairField?.parent_id) {
        valuePath = `${valuePath ?? ''}.${currentFairField?.short_name}`;
        currentFairField = allFairFields.find(
          (ff) => ff.fair_field_id == currentFairField?.parent_id,
        );
      }

      valuePath = `${valuePath ?? ''}.${currentFairField?.short_name}`;
      valuePath = valuePath.indexOf('.') == 0 ? valuePath.slice(1) : valuePath;
      const pathArray: string[] = valuePath.split('.').reverse();
      let value: number;
      let currentObject: FairSpecificData | FullFairData =
        resultsKnowledgeProductDto.fair_data;
      if (field == FairFieldEnum.TOTAL) {
        value = currentObject?.total_score;
      } else {
        let currentPath = pathArray.shift();
        if (pathArray.length == 0) {
          value = currentObject[currentPath]?.score;
        } else {
          while (pathArray.length > 0) {
            currentObject = (
              currentObject[currentPath] as FairSpecificData
            ).indicators.find((i) => i.name == pathArray[0]);
            value = currentObject?.score;
            currentPath = pathArray.shift();
          }
        }
      }

      currentFairFieldObject.fair_value = value;
      currentFairFieldObject.is_baseline = false;
      if (!currentFairFieldObject.created_by) {
        currentFairFieldObject.created_by = upsert
          ? knowledgeProduct.last_updated_by
          : knowledgeProduct.created_by;
      } else {
        currentFairFieldObject.last_updated_by =
          knowledgeProduct.last_updated_by;
      }

      switch (field) {
        case FairFieldEnum.FINDABLE:
          knowledgeProduct.findable = value;
          break;
        case FairFieldEnum.ACCESIBLE:
          knowledgeProduct.accesible = value;
          break;
        case FairFieldEnum.INTEROPERABLE:
          knowledgeProduct.interoperable = value;
          break;
        case FairFieldEnum.REUSABLE:
          knowledgeProduct.reusable = value;
          break;
        default:
          break;
      }

      updatedFields.push(currentFairFieldObject);
    }

    if (!upsert) {
      const baselineFields: ResultsKnowledgeProductFairScore[] = [];
      updatedFields.forEach((fs) => {
        const baselineField = new ResultsKnowledgeProductFairScore();
        baselineField.result_knowledge_product_id =
          fs.result_knowledge_product_id;
        baselineField.fair_field_id = fs.fair_field_id;
        baselineField.fair_value = fs.fair_value;
        baselineField.is_baseline = true;
        baselineField.created_by = fs.created_by;
        baselineField.last_updated_by = fs.last_updated_by;
        baselineFields.push(baselineField);
      });

      updatedFields = updatedFields.concat(baselineFields);
    }

    knowledgeProduct.result_knowledge_product_fair_score_array = updatedFields;
  }

  async updateCountries(
    newKnowledgeProduct: ResultsKnowledgeProduct,
    resultsKnowledgeProductDto: ResultsKnowledgeProductDto,
    upsert = false,
  ) {
    const allClarisaCountries = await this._clarisaCountriesRepository.find();

    const countries = (resultsKnowledgeProductDto.cgspace_countries ?? []).map(
      (mqapIso) => {
        let country: ResultCountry;
        if (upsert) {
          country = (
            newKnowledgeProduct.result_object.result_country_array ?? []
          ).find((orc) => orc.country_object?.iso_alpha_2 == mqapIso);
          if (country) {
            country['matched'] = true;
          }
        }

        country ??= new ResultCountry();

        //searching for country by iso-2
        const clarisaCountry = allClarisaCountries.find(
          (cc) => cc.iso_alpha_2 == mqapIso,
        )?.id;

        country.country_id = clarisaCountry;
        if (!clarisaCountry) {
          console.warn(
            `country with ISO Code "${mqapIso}" does not have a mapping in CLARISA for handle "${resultsKnowledgeProductDto.handle}"`,
          );
        }

        country.result_id = newKnowledgeProduct.results_id;

        return country;
      },
    );

    (newKnowledgeProduct.result_object.result_country_array ?? []).forEach(
      (oc) => {
        if (!oc['matched']) {
          if (oc.result_country_id) {
            oc.is_active = false;
          }

          countries.push(oc);
        } else {
          delete oc['matched'];
        }
      },
    );

    newKnowledgeProduct.result_object.result_country_array = countries;
  }

  async findOnCGSpace(
    handle: string,
    versionCgspaceYear: number,
    validateExisting = true,
  ) {
    try {
      if (!handle) {
        throw {
          response: {},
          message: 'Missing data: handle',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      if (validateExisting) {
        const currentVersion: Version =
          await this._versioningService.$_findActivePhase(
            AppModuleIdEnum.REPORTING,
          );
        versionCgspaceYear = currentVersion?.phase_year;
      }

      const hasQuery = (handle ?? '').indexOf('?');
      const linkSplit = (handle ?? '')
        .slice(0, hasQuery != -1 ? hasQuery : handle.length)
        .split('/');
      const handleId = linkSplit.slice(linkSplit.length - 2).join('/');

      let response: ResultsKnowledgeProductDto = null;
      if (validateExisting) {
        const resultKnowledgeProduct: ResultsKnowledgeProduct =
          await this._resultsKnowledgeProductRepository.findOne({
            where: {
              handle: Like(handleId),
              result_object: {
                is_active: true,
              },
            },
            relations: this._resultsKnowledgeProductRelations,
          });

        if (resultKnowledgeProduct) {
          const infoToMap = await this._resultRepository.getResultInfoToMap(
            resultKnowledgeProduct.results_id,
          );
          return {
            response: infoToMap,
            message:
              'This knowledge product has already been reported in the PRMS Reporting Tool.',
            status: HttpStatus.CONFLICT,
          };
        }
      }

      const mqapResponse: MQAPResultDto =
        await this._mqapService.getDataFromCGSpaceHandle(handle);

      if (!mqapResponse) {
        throw {
          response: {},
          message: `Please add a valid handle (received: ${handle}). Only handles from CGSpace can be reported.`,
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const cgYear =
        this._resultsKnowledgeProductMapper.getPublicationYearFromMQAPResponse(
          mqapResponse,
        );

      if ((cgYear.year ?? 0) != versionCgspaceYear) {
        throw {
          response: { title: mqapResponse?.Title },
          message:
            `Reporting knowledge products from years outside the current reporting cycle (${versionCgspaceYear}) is not possible. ` +
            'Should you require assistance in modifying the publication year for this knowledge product, ' +
            'please contact your Center’s knowledge management team to review this information in CGSpace.',
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        };
      } else if (
        (cgYear.field_name != 'online_publication_date' &&
          (mqapResponse?.Type ?? '') == 'Journal Article') ||
        (cgYear.field_name == 'online_publication_date' &&
          (mqapResponse?.Type ?? '') == 'Journal Article' &&
          (cgYear.year ?? 0) != versionCgspaceYear)
      ) {
        const dateFieldName = (cgYear?.field_name ?? '')
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        throw {
          response: { title: mqapResponse?.Title },
          message:
            `Only journal articles published online in ${versionCgspaceYear} are eligible for this reporting cycle.<br>` +
            'The knowledge product you are attempting to report either lacks the online publication date in CGSpace ' +
            `or has an online publication date other than ${versionCgspaceYear}.<br><br>` +
            'If you believe this is an error, please contact your Center’s knowledge management team to review this information in CGSpace.<br><br>' +
            '<b>About this error:</b><br>Please be aware that for journal articles, the reporting system automatically verifies ' +
            `the “Date Online” field in CGSpace, specifically checking for the year ${versionCgspaceYear}. If this field is empty or contains a year ` +
            `other than ${versionCgspaceYear}, the submission will not be accepted. This prevents double counting of publications across consecutive years.`,
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        };
      }

      response =
        this._resultsKnowledgeProductMapper.mqapResponseToKnowledgeProductDto(
          mqapResponse,
        );

      return {
        response: response,
        message: `The Result Knowledge Product ${
          !validateExisting ? 'is yet to be created' : 'can be updated'
        }`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async create(
    resultsKnowledgeProductDto: ResultsKnowledgeProductDto,
    user: TokenDto,
  ) {
    try {
      if (!resultsKnowledgeProductDto.result_data) {
        throw {
          response: {},
          message: 'missing data needed to create a result',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const currentVersion: Version =
        await this._versioningService.$_findActivePhase(
          AppModuleIdEnum.REPORTING,
        );

      if (!currentVersion) {
        throw {
          response: {},
          message: 'Current Version Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const newResultResponse = await this.createOwnerResult(
        resultsKnowledgeProductDto.result_data,
        user,
      );

      if (newResultResponse.status >= 300) {
        throw this._handlersError.returnErrorRes({ error: newResultResponse });
      }

      const newResult = newResultResponse.response as Result;
      resultsKnowledgeProductDto.version_id = newResult.version_id;
      resultsKnowledgeProductDto.result_code = newResult.result_code;

      let newKnowledgeProduct: ResultsKnowledgeProduct =
        new ResultsKnowledgeProduct();
      newKnowledgeProduct = this._resultsKnowledgeProductMapper.updateEntity(
        newKnowledgeProduct,
        resultsKnowledgeProductDto,
        user.id,
        newResult.id,
      );

      newKnowledgeProduct.is_melia = false;
      newKnowledgeProduct.result_object = newResult;

      newKnowledgeProduct = await this._resultsKnowledgeProductRepository.save(
        newKnowledgeProduct,
      );

      resultsKnowledgeProductDto.id = newResult.id;

      newKnowledgeProduct =
        this._resultsKnowledgeProductMapper.populateKPRelations(
          newKnowledgeProduct,
          resultsKnowledgeProductDto,
        );

      await this.separateCentersFromCgspacePartners(newKnowledgeProduct, false);

      //updating relations
      await this._resultsKnowledgeProductAltmetricRepository.save(
        newKnowledgeProduct.result_knowledge_product_altmetric_array ?? [],
      );
      await this._resultsKnowledgeProductAuthorRepository.save(
        newKnowledgeProduct.result_knowledge_product_author_array ?? [],
      );
      await this._resultsKnowledgeProductInstitutionRepository.save(
        newKnowledgeProduct.result_knowledge_product_institution_array ?? {},
      );
      await this._resultsKnowledgeProductKeywordRepository.save(
        newKnowledgeProduct.result_knowledge_product_keyword_array ?? [],
      );
      await this._resultsKnowledgeProductMetadataRepository.save(
        newKnowledgeProduct.result_knowledge_product_metadata_array ?? [],
      );

      //geolocation
      await this.updateCountries(
        newKnowledgeProduct,
        resultsKnowledgeProductDto,
        false,
      );

      await this._resultCountryRepository.save(
        newKnowledgeProduct.result_object.result_country_array ?? [],
      );

      await this.updateGeoLocation(
        newResult,
        newKnowledgeProduct,
        resultsKnowledgeProductDto,
      );

      await this._resultRegionRepository.save(
        newResult.result_region_array ?? [],
      );

      /*const fairBaseline = new KnowledgeProductFairBaseline();

      fairBaseline.findable = newKnowledgeProduct.findable;
      fairBaseline.accesible = newKnowledgeProduct.accesible;
      fairBaseline.interoperable = newKnowledgeProduct.interoperable;
      fairBaseline.reusable = newKnowledgeProduct.reusable;
      fairBaseline.created_by = newKnowledgeProduct.created_by;
      fairBaseline.knowledge_product_id =
        newKnowledgeProduct.result_knowledge_product_id;

      await this._knowledgeProductFairBaselineRepository.save(fairBaseline);*/
      await this.updateFair(
        newKnowledgeProduct,
        resultsKnowledgeProductDto,
        false,
      );
      await this._resultsKnowledgeProductFairScoreRepository.save(
        newKnowledgeProduct.result_knowledge_product_fair_score_array ?? [],
      );
      await this._resultsKnowledgeProductRepository.update(
        {
          result_knowledge_product_id:
            newKnowledgeProduct.result_knowledge_product_id,
        },
        {
          findable: newKnowledgeProduct.findable,
          accesible: newKnowledgeProduct.accesible,
          interoperable: newKnowledgeProduct.interoperable,
          reusable: newKnowledgeProduct.reusable,
        },
      );

      //updating general result tables
      await this._resultRepository.update(
        { id: newResult.id },
        {
          title: resultsKnowledgeProductDto.title,
          description: resultsKnowledgeProductDto.description,
        },
      );

      //TODO: update geoscope table

      //adding link to this knowledge product to existing evidences
      this._evidenceRepository
        .findBy({ link: Like(resultsKnowledgeProductDto.handle) })
        .then((re) => {
          return Promise.all(
            re.map((e) => {
              this._evidenceRepository.update(
                { id: e.id },
                {
                  knowledge_product_related: newResult.id,
                  result_id: newResult.id,
                  evidence_type_id: 1,
                },
              );
            }),
          );
        })
        .catch((error) => this._handlersError.returnErrorRes({ error }));

      //creating own evidence linking it to itself
      this._evidenceRepository.save({
        link: `https://cgspace.cgiar.org/handle/${resultsKnowledgeProductDto.handle}`,
        result_id: newResult.id,
        created_by: user.id,
        is_supplementary: false,
        evidence_type_id: 1,
      });

      return {
        response: resultsKnowledgeProductDto,
        message: 'The Result Knowledge Product has been created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async separateCentersFromCgspacePartners(
    knowledgeProduct: ResultsKnowledgeProduct,
    upsert = false,
  ) {
    // we get the centers currently mapped to the result
    const sectionTwoCenters = await this._resultCenterRepository.find({
      where: {
        result_id: knowledgeProduct.result_object.id,
        is_active: true,
      },
      relations: {
        clarisa_center_object: true,
      },
    });

    /*if the kp is new, we need to load the institution corresponding to the 
    id returned by cgspace in order to execute the next step*/
    if (!upsert) {
      const possibleCgInstitutionIds = (
        knowledgeProduct.result_knowledge_product_institution_array ?? []
      )
        .filter((cgi) => cgi.predicted_institution_id)
        .map((cgi) => cgi.predicted_institution_id);
      const possibleCgInstitutions =
        await this._clarisaInstitutionRepository.find({
          where: {
            id: In(possibleCgInstitutionIds),
          },
          relations: { clarisa_center: true },
        });

      knowledgeProduct.result_knowledge_product_institution_array = (
        knowledgeProduct.result_knowledge_product_institution_array ?? []
      ).map((cgi) => {
        const possibleCgInstitution = possibleCgInstitutions.find(
          (pci) => pci.id == cgi.predicted_institution_id,
        );
        if (possibleCgInstitution) {
          cgi.predicted_institution_object = possibleCgInstitution;
        }
        return cgi;
      });
    }

    let newSectionTwoCenters: ResultsCenter[] = [];

    const updatedCgInstitutions = (
      knowledgeProduct.result_knowledge_product_institution_array ?? []
    ).map((cgi) => {
      //if m-qap >97% certain of the institution match AND the institution is a center
      if (
        cgi.confidant > 97 &&
        cgi.predicted_institution_object.clarisa_center
      ) {
        cgi.is_active = false;
      }

      //if the center has not been mapped already, we will create a new db record
      if (
        !sectionTwoCenters.find(
          (stc) =>
            stc.clarisa_center_object.institutionId ==
            cgi.predicted_institution_id,
        ) &&
        cgi.predicted_institution_object.clarisa_center
      ) {
        const newSectionTwoCenter: ResultsCenter = new ResultsCenter();
        newSectionTwoCenter.center_id =
          cgi.predicted_institution_object.clarisa_center.code;
        newSectionTwoCenter.is_primary = false;
        newSectionTwoCenter.result_id = knowledgeProduct.results_id;
        newSectionTwoCenter.created_by =
          knowledgeProduct.last_updated_by || knowledgeProduct.created_by;
        newSectionTwoCenter.from_cgspace = true;

        newSectionTwoCenters.push(newSectionTwoCenter);
      }

      return cgi;
    });

    if (upsert) {
      //if the center already existed, we will update the flag depending on
      //the check if now comes from cgspace or not
      sectionTwoCenters.forEach((stc) => {
        const updatedCenter = updatedCgInstitutions.find(
          (cgi) =>
            cgi.predicted_institution_id ==
            stc.clarisa_center_object.institutionId,
        );

        stc.from_cgspace = !!updatedCenter;
      });
    }

    newSectionTwoCenters = await this._resultCenterRepository.save([
      ...newSectionTwoCenters,
      ...sectionTwoCenters,
    ]);

    knowledgeProduct.result_knowledge_product_institution_array =
      updatedCgInstitutions;
  }

  private async updateGeoLocation(
    newResult: Result,
    newKnowledgeProduct: ResultsKnowledgeProduct,
    resultsKnowledgeProductDto: ResultsKnowledgeProductDto,
  ) {
    //loading the world tree. this will help us immensely in the following steps
    const worldTree = await this._clarisaRegionsRepository.loadWorldTree();

    //cleaning regions
    const resultRegions = (newResult.result_region_array ?? [])
      .filter((rr) => rr.region_id)
      .map((rr) => {
        rr.region_object = worldTree.findById(rr.region_id)?.data;
        return rr;
      });
    const regions = resultRegions.map((rr) => rr.region_object);

    let cleanedCGRegions: ClarisaRegion[] = [];
    for (const region of regions) {
      //1. we check if the region has been added before. if so, we ignore it
      if (cleanedCGRegions.some((r) => r.um49Code == region.um49Code)) {
        continue;
      }

      //2. we check if the cleanedRegions array at least one descendant.
      if (cleanedCGRegions.some((r) => worldTree.isDescendant(r, region))) {
        //2.a we ignore it, as it has a descendant already in the list
        continue;
      }

      //3. we check if the cleanedRegions array has one or multiple ancestors
      const ancestors = cleanedCGRegions.filter((r) =>
        worldTree.isAncestor(r, region),
      );
      //3.a if there are ancestors, we remove them from the cleanedRegions list
      cleanedCGRegions = cleanedCGRegions.filter(
        (r) => !ancestors.find((a) => a.um49Code == r.um49Code),
      );

      //4. we add it to the cleanedRegions list
      cleanedCGRegions.push(region);
    }

    /*
      now that we have all the "leaves" from the regions coming from CGSpace,
      we need to verify if the regions are not roots. so, using the worldTree, 
      we find the region on the tree and get the parent of the region.
      if the region itself is not a root, it should be preserved. 
      if it is, the region children will be used instead.
    */
    const processedCleanedRegions: ClarisaRegion[] = cleanedCGRegions.flatMap(
      (crn) => {
        const regionNode = worldTree.find(crn);
        const regionLevel = regionNode.data?.['level'] ?? 0;
        if (regionLevel == 0) {
          return []; // should not happen
        }
        return regionLevel == 1 ? regionNode.childrenData : [crn];
      },
    );

    /* 
      we check if the region was already mapped to the result. if it was, we 
      remove it from the processedCleanedRegions and add the mapped region to the
      final cleanedResultRegions. if not, nothing happens
    */
    const cleanedResultRegions: ResultRegion[] = [];
    for (const rr of resultRegions) {
      const inProcessed = processedCleanedRegions.findIndex(
        (cr) => rr.region_id == cr.um49Code,
      );
      if (inProcessed > -1) {
        cleanedResultRegions.push(rr);
        processedCleanedRegions.splice(inProcessed, 1);
      } else {
        if (rr.result_region_id) {
          rr.is_active = false;
          cleanedResultRegions.push(rr);
        }
      }
    }

    /*
      if there are still regions that are not mapped to the result, we create them
    */
    for (const pcr of processedCleanedRegions) {
      const newResultRegion = new ResultRegion();
      newResultRegion.result_id = newResult.id;
      newResultRegion.region_id = pcr.um49Code;

      cleanedResultRegions.push(newResultRegion);
    }
    //end cleaning regions

    newResult.result_region_array = cleanedResultRegions;
    newResult.has_regions = (newResult.result_region_array ?? []).length != 0;

    newResult.has_countries =
      (newResult.result_country_array ?? []).length != 0;
    //newResult.has_regions = (newKnowledgeProduct.cgspace_regions??'').length != 0;

    if (resultsKnowledgeProductDto.is_global_geoscope) {
      newResult.geographic_scope_id = 1;
    } else if (!newResult.has_countries && !newResult.has_regions) {
      /*
      in case we do not explicitly receive "global" as a region from M-QAP,
      but the countries and regions array is empty, we are going to flag this
      as "to be determined"
      */
      newResult.geographic_scope_id = 50;
    } else {
      if (newResult.has_regions) {
        newResult.geographic_scope_id = 2;
      } else {
        newResult.geographic_scope_id =
          (newResult.result_country_array ?? []).length > 1 ? 3 : 4;
      }
    }

    //updating general result tables
    await this._resultRepository.update(
      { id: newResult.id },
      {
        geographic_scope_id: newResult.geographic_scope_id,
        has_countries: newResult.has_countries,
        has_regions: newResult.has_regions,
      },
    );
  }

  async findResultKnowledgeProductByHandle(handle: string) {
    try {
      if ((handle ?? '').length < 1) {
        throw {
          response: {},
          message: 'missing data: handle',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const knowledgeProduct =
        await this._resultsKnowledgeProductRepository.findOneBy({
          handle: Like(handle),
        });

      if (!knowledgeProduct) {
        throw {
          response: {},
          message: `There is not a Knowledge Product with the handle ${handle}`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      const response =
        this._resultsKnowledgeProductMapper.entityToDto(knowledgeProduct);
      return {
        response,
        message:
          'This knowledge product has already been reported in the PRMS Reporting Tool.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async findOneByKnowledgeProductId(id: number) {
    try {
      if (id < 1) {
        throw {
          response: {},
          message: 'missing data: id',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const knowledgeProduct =
        await this._resultsKnowledgeProductRepository.findOneBy({
          result_knowledge_product_id: id,
        });

      if (!knowledgeProduct) {
        throw {
          response: {},
          message: `There is not a Knowledge Product with the id ${id}`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      const response =
        this._resultsKnowledgeProductMapper.entityToDto(knowledgeProduct);

      // validations
      response.warnings = this.getWarnings(response);

      return {
        response,
        message: 'The Result Knowledge Product has already been created.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async findOneByResultId(id: number) {
    try {
      if (id < 1) {
        throw {
          response: {},
          message: 'missing data: id',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const result = await this._resultRepository.findOneBy({
        id,
      });

      if (!result) {
        throw {
          response: {},
          message: `There is not a Result with the id ${id}`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      const knowledgeProduct =
        await this._resultsKnowledgeProductRepository.findOne({
          where: {
            results_id: result.id,
            //...this._resultsKnowledgeProductWhere,
          },
          relations: { result_object: { obj_version: true } },
        });

      if (!knowledgeProduct) {
        throw {
          response: {},
          message: `The Result with id ${id} does not have a linked Knowledge Product Details`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      knowledgeProduct.result_knowledge_product_author_array =
        await this._resultsKnowledgeProductAuthorRepository.find({
          where: {
            result_knowledge_product_id:
              knowledgeProduct.result_knowledge_product_id,
            is_active: true,
          },
        });

      knowledgeProduct.result_knowledge_product_altmetric_array =
        await this._resultsKnowledgeProductAltmetricRepository.find({
          where: {
            result_knowledge_product_id:
              knowledgeProduct.result_knowledge_product_id,
            is_active: true,
          },
        });

      knowledgeProduct.result_knowledge_product_institution_array =
        await this._resultsKnowledgeProductInstitutionRepository.find({
          where: {
            result_knowledge_product_id:
              knowledgeProduct.result_knowledge_product_id,
            is_active: true,
          },
        });

      knowledgeProduct.result_knowledge_product_keyword_array =
        await this._resultsKnowledgeProductKeywordRepository.find({
          where: {
            result_knowledge_product_id:
              knowledgeProduct.result_knowledge_product_id,
            is_active: true,
          },
        });

      knowledgeProduct.result_knowledge_product_metadata_array =
        await this._resultsKnowledgeProductMetadataRepository.find({
          where: {
            result_knowledge_product_id:
              knowledgeProduct.result_knowledge_product_id,
            is_active: true,
          },
        });

      knowledgeProduct.result_knowledge_product_fair_score_array =
        await this._resultsKnowledgeProductFairScoreRepository.find({
          where: {
            result_knowledge_product_id:
              knowledgeProduct.result_knowledge_product_id,
            is_active: true,
            is_baseline: false,
          },
          relations: {
            fair_field_object: {
              parent_object: true,
            },
          },
        });

      const response =
        this._resultsKnowledgeProductMapper.entityToDto(knowledgeProduct);

      // validations
      response.warnings = this.getWarnings(response);

      return {
        response,
        message: 'The Result Knowledge Product has been found.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  getWarnings(response: ResultsKnowledgeProductDto): string[] {
    const warnings: string[] = [];

    if (response.doi?.length < 1) {
      warnings.push(
        'Journal articles without the DOI will directly go to ' +
          'the Quality Assurance. In case you need support to add the DOI in CGSPACE, ' +
          'please contact the librarian of your Center.',
      );
    }

    if (response.doi?.length > 1 && !response.altmetric_detail_url) {
      warnings.push(
        'Please make sure the DOI is valid otherwise the journal article will directly go ' +
          'to the Quality Assurance. In case you need support to correct the DOI in CGSPACE, ' +
          'please contact the librarian of your Center.',
      );
    }

    const cgspaceMetadata = response.metadata.find(
      (m) => m.source === 'CGSpace',
    );
    const wosMetadata = response.metadata.find((m) => m.source !== 'CGSpace');

    if (response.type == 'Journal Article') {
      if (
        (cgspaceMetadata?.issue_year ?? 0) !== (wosMetadata?.issue_year ?? 0)
      ) {
        warnings.push(
          'The year of publication is automatically retrieved from an external service (Web ' +
            'of Science or Scopus). In case of inconsistencies, the CGIAR Quality Assurance ' +
            'team will manually validate the record. We remind you that only knowledge products ' +
            'published in 2022 can be reported.',
        );
      }

      if ((wosMetadata?.issue_year ?? 0) < 1) {
        warnings.push(
          'The year of publication is automatically retrieved from an external service (Web ' +
            'of Science or Scopus). If the year does not show, it might be due to a delay in ' +
            'the indexing. The CGIAR Quality Assurance team will validate this information at ' +
            'the end of the reporting cycle.',
        );
      }
    }

    return warnings;
  }

  async upsert(
    id: number,
    user: TokenDto,
    sectionSevenData: ResultsKnowledgeProductSaveDto,
  ) {
    try {
      if (id < 1) {
        throw {
          response: {},
          message: 'missing data: id',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const result = await this._resultRepository.findOneBy({
        id,
      });

      if (!result) {
        throw {
          response: {},
          message: `There is not a Result with the id ${id}`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      let knowledgeProduct =
        await this._resultsKnowledgeProductRepository.findOne({
          where: { results_id: result.id },
        });

      if (!knowledgeProduct) {
        throw {
          response: {},
          message: `The Result with id ${id} does not have a linked Knowledge Product Details`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      if (!sectionSevenData.isMeliaProduct) {
        sectionSevenData.ostSubmitted = null;
        sectionSevenData.ostMeliaId = null;
        sectionSevenData.clarisaMeliaTypeId = null;
      }

      if (sectionSevenData.ostSubmitted) {
        sectionSevenData.clarisaMeliaTypeId = null;
      } else {
        sectionSevenData.ostMeliaId = null;
      }

      await this._resultsKnowledgeProductRepository.update(
        {
          result_knowledge_product_id:
            knowledgeProduct.result_knowledge_product_id,
        },
        {
          last_updated_by: user.id,
          is_melia: sectionSevenData.isMeliaProduct,
          melia_previous_submitted: sectionSevenData.ostSubmitted,
          melia_type_id: sectionSevenData.clarisaMeliaTypeId,
          ost_melia_study_id: sectionSevenData.ostMeliaId,
        },
      );

      knowledgeProduct = await this._resultsKnowledgeProductRepository.findOne({
        where: { results_id: result.id },
        relations: this._resultsKnowledgeProductRelations,
      });

      return {
        response: {},
        message: 'The section has been updated successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async findAllActiveKps() {
    try {
      const kps = await this._resultsKnowledgeProductRepository.find({
        where: {
          is_active: true,
          result_object: {
            is_active: true,
          },
        },
        relations: {
          result_object: true,
        },
      });

      return {
        response: kps,
        message:
          'The active knowledge products have been retrieved successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async getSectionSevenDataForReport(resultCodesArray: number[]) {
    try {
      const data =
        await this._resultsKnowledgeProductRepository.getSectionSevenDataForReport(
          resultCodesArray,
        );

      return {
        response: data,
        message:
          'The data for the knowledge products have been retrieved successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }
}
