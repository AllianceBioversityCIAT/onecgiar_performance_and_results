import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateResultsPackageTocResultDto } from './dto/create-results-package-toc-result.dto';
import { UpdateResultsPackageTocResultDto } from './dto/update-results-package-toc-result.dto';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { VersionsService } from '../../results/versions/versions.service';
import { ResultRepository } from '../../results/result.repository';
import { Version } from '../../versioning/entities/version.entity';
import { TokenDto } from '../../../shared/globalInterfaces/token.dto';
import { Result } from '../../results/entities/result.entity';
import { CreateResultsTocResultDto } from '../../results/results-toc-results/dto/create-results-toc-result.dto';
import { IpsrRepository } from '../repository/ipsr.repository';
import { NonPooledProjectRepository } from '../../results/non-pooled-projects/non-pooled-projects.repository';
import { ResultsCenterRepository } from '../../results/results-centers/results-centers.repository';
import { ResultByInitiativesRepository } from '../../results/results_by_inititiatives/resultByInitiatives.repository';
import { ResultsTocResultRepository } from '../../results/results-toc-results/results-toc-results.repository';
import { resultPackageTocResultDTO } from './dto/result-package-toc-result.dto';
import { ResultByIntitutionsRepository } from '../../results/results_by_institutions/result_by_intitutions.repository';
import { ResultByInstitutionsByDeliveriesTypeRepository } from '../../results/result-by-institutions-by-deliveries-type/result-by-institutions-by-deliveries-type.repository';
import { ResultsByInstitution } from '../../results/results_by_institutions/entities/results_by_institution.entity';
import { CreateTocShareResult } from '../../results/share-result-request/dto/create-toc-share-result.dto';
import { ShareResultRequestService } from '../../results/share-result-request/share-result-request.service';
import { ShareResultRequestRepository } from '../../results/share-result-request/share-result-request.repository';
import { NonPooledProject } from '../../results/non-pooled-projects/entities/non-pooled-project.entity';
import { ResultIpEoiOutcomeRepository } from '../innovation-pathway/repository/result-ip-eoi-outcomes.repository';
import { ResultInnovationPackageRepository } from '../result-innovation-package/repositories/result-innovation-package.repository';

@Injectable()
export class ResultsPackageTocResultService {
  constructor(
    protected readonly _nonPooledProjectRepository: NonPooledProjectRepository,
    protected readonly _resultsCenterRepository: ResultsCenterRepository,
    protected readonly _resultByInitiativesRepository: ResultByInitiativesRepository,
    protected readonly _resultsTocResultRepository: ResultsTocResultRepository,
    protected readonly _resultByIntitutionsRepository: ResultByIntitutionsRepository,
    protected readonly _resultByInstitutionsByDeliveriesTypeRepository: ResultByInstitutionsByDeliveriesTypeRepository,
    protected readonly _resultIpEoiOutcomesRepository: ResultIpEoiOutcomeRepository,
    protected readonly _shareResultRequestService: ShareResultRequestService,
    protected readonly _shareResultRequestRepository: ShareResultRequestRepository,
    protected readonly _resultRepository: ResultRepository,
    protected readonly _versionsService: VersionsService,
    protected readonly _ipsrRepository: IpsrRepository,
    protected readonly _handlersError: HandlersError,
  ) {}

  async create(crtr: CreateResultsPackageTocResultDto, user: TokenDto) {
    //create Contributing initiative
    try {
      const rip = await this._resultRepository.getResultById(crtr.result_id);
      if (!rip) {
        throw {
          response: {
            result_id: crtr.result_id,
          },
          message: `result_id: ${crtr.result_id} - does not exist`,
          status: HttpStatus.BAD_REQUEST,
        };
      }
      const iprsCore = await this._ipsrRepository.findOne({
        where: {
          result_innovation_package_id: rip.id,
          is_active: true,
          ipsr_role_id: 1,
        },
      });
      const result = await this._resultRepository.getResultById(
        iprsCore.result_id,
      );
      if (!result) {
        throw {
          response: {
            result_id: rip.id,
          },
          message: `result_id: ${rip.id} - does not exist`,
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const vTemp = await this._versionsService.findBaseVersion();
      if (vTemp.status >= 300) {
        throw this._handlersError.returnErrorRes({ error: vTemp });
      }
      const version: Version = <Version>vTemp.response;

      if (crtr?.contributing_initiatives.length) {
        const { contributing_initiatives: cinit } = crtr;
        for (const init of cinit) {
          if (init?.is_active == false) {
            await this._resultByInitiativesRepository.update(
              { result_id: rip.id, initiative_id: init.id },
              { is_active: false },
            );
          }
        }

        const dataRequst: CreateTocShareResult = {
          isToc: true,
          initiativeShareId: cinit.map((el) => el.id),
          action_area_outcome_id: null,
          planned_result: null,
          toc_result_id: null,
        };
        await this._shareResultRequestService.resultRequest(
          dataRequst,
          rip.id,
          user,
        );
      }

      if (crtr?.pending_contributing_initiatives.length) {
        const { pending_contributing_initiatives: pint } = crtr;
        const cancelRequest = pint?.filter((e) => e.is_active == false);
        if (cancelRequest?.length) {
          await this._shareResultRequestRepository.cancelRequest(
            cancelRequest.map((e) => e.share_result_request_id),
          );
        }
      }

      //!contributing_np_projects

      if (crtr?.contributing_np_projects?.length) {
        const { contributing_np_projects: cnpp } = crtr;
        const titles = cnpp.map((el) => el.grant_title);

        await this._nonPooledProjectRepository.updateNPProjectById(
          rip.id,
          titles,
          user.id,
          1,
        );
        for (const cpnp of cnpp) {
          let nonPP: NonPooledProject = null;
          if (cpnp?.grant_title?.length) {
            if (cpnp?.id) {
              nonPP =
                await this._nonPooledProjectRepository.getAllNPProjectByNPId(
                  rip.id,
                  cpnp.id,
                  1,
                );
            } else {
              nonPP =
                await this._nonPooledProjectRepository.getAllNPProjectById(
                  rip.id,
                  cpnp.grant_title,
                  1,
                );
            }
            if (nonPP) {
              this._nonPooledProjectRepository.update(nonPP.id, {
                is_active: true,
                center_grant_id: cpnp.center_grant_id,
                funder_institution_id: cpnp.funder,
                lead_center_id: cpnp.lead_center,
                last_updated_by: user.id,
                grant_title: cpnp.grant_title,
              });
            } else {
              this._nonPooledProjectRepository.save({
                results_id: rip.id,
                center_grant_id: cpnp.center_grant_id,
                grant_title: cpnp.grant_title,
                funder_institution_id: cpnp.funder,
                lead_center_id: cpnp.lead_center,
                version_id: version.id,
                created_by: user.id,
                last_updated_by: user.id,
                non_pooled_project_type_id: 1,
              });
            }
          }
        }
      } else {
        await this._nonPooledProjectRepository.updateNPProjectById(
          rip.id,
          [],
          user.id,
          1,
        );
      }

      //!contributing_center

      if (crtr?.contributing_center?.length) {
        const { contributing_center: cc } = crtr;
        const code = cc.map((el) => el.code);
        await this._resultsCenterRepository.updateCenter(rip.id, code, user.id);

        for (const cenCC of cc) {
          cenCC.primary = cenCC.primary || false;
          const rpC =
            await this._resultsCenterRepository.getAllResultsCenterByResultIdAndCenterId(
              rip.id,
              cenCC.code,
            );
          if (rpC) {
            this._resultsCenterRepository.update(rpC.id, {
              is_active: true,
              is_primary: cenCC.primary,
              last_updated_by: user.id,
            });
          } else {
            this._resultsCenterRepository.save({
              center_id: cenCC.code,
              result_id: rip.id,
              created_by: user.id,
              last_updated_by: user.id,
              is_primary: cenCC.primary,
              version_id: version.id,
            });
          }
        }
      } else {
        await this._resultsCenterRepository.updateCenter(rip.id, [], user.id);
      }

      const { result_toc_result, contributors_result_toc_result } = crtr;

      // !result_toc_result
      const saveTocResult = await this.saveResultPackageTocResult(
        rip,
        user,
        version,
        true,
        result_toc_result,
      );

      // * Save EOI
      await this.saveIpEoi(
        result_toc_result.toc_result_id,
        rip.id,
        user,
        version,
        result_toc_result,
      );

      // !agregar la logica de cancelacion iniciativa
      // !con_result_toc_result

      const crpi =
        await this._resultByInitiativesRepository.getContributorInitiativeByResult(
          rip.id,
        );
      const iniId = crpi.map((el) => el.id);
      const saveConInit = contributors_result_toc_result.filter((el) =>
        iniId.includes(el.initiative_id),
      );
      for (const crtr of saveConInit) {
        await this.saveResultPackageTocResult(rip, user, version, false, crtr);
      }

      if (crtr?.institutions.length) {
        const { institutions: inst } = crtr;
        await this._resultByIntitutionsRepository.updateIstitutions(
          rip.id,
          inst,
          false,
          user.id,
        );
        for (const ins of inst) {
          const instExist =
            await this._resultByIntitutionsRepository.getGenericResultByInstitutionExists(
              rip.id,
              ins.institutions_id,
              2,
            );
          let rbi: ResultsByInstitution = null;
          if (!instExist) {
            rbi = await this._resultByIntitutionsRepository.save({
              institution_roles_id: 2,
              institutions_id: ins.institutions_id,
              result_id: rip.id,
              version_id: version.id,
              created_by: user.id,
              last_updated_by: user.id,
            });
          }

          if (ins?.deliveries?.length) {
            const { deliveries } = ins;
            await this.saveDeliveries(
              instExist ? instExist : rbi,
              deliveries,
              user.id,
              version,
            );
          } else {
            await this._resultByInstitutionsByDeliveriesTypeRepository.inactiveResultDeLivery(
              (instExist ? instExist : rbi).id,
              [],
              user.id,
            );
          }
        }
      } else {
        await this._resultByIntitutionsRepository.updateIstitutions(
          rip.id,
          [],
          false,
          user.id,
        );
      }

      return {
        response: {},
        message: 'The toc data is successfully created',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  protected async saveDeliveries(
    inst: ResultsByInstitution,
    deliveries: number[],
    userId: number,
    v: Version,
  ) {
    await this._resultByInstitutionsByDeliveriesTypeRepository.inactiveResultDeLivery(
      inst.id,
      deliveries,
      userId,
    );
    for (const deli of deliveries) {
      const deliExist =
        await this._resultByInstitutionsByDeliveriesTypeRepository.getDeliveryByTypeAndResultByInstitution(
          inst.id,
          deli,
        );
      if (!deliExist) {
        await this._resultByInstitutionsByDeliveriesTypeRepository.save({
          partner_delivery_type_id: deli,
          result_by_institution_id: inst.id,
          last_updated_by: userId,
          created_by: userId,
          versions_id: v.id,
        });
      }
    }
  }

  protected async saveResultPackageTocResult(
    rip: Result,
    user: TokenDto,
    version: Version,
    owner: boolean,
    rtr: resultToResultInterfaceToc,
  ) {
    const {
      planned_result,
      initiative_id,
      toc_result_id,
      result_toc_result_id,
    } = rtr;
    const rptr = await this._resultsTocResultRepository.getNewRTRById(
      result_toc_result_id,
      rip.id,
      rip.initiative_id,
    );
    if (rptr) {
      await this._resultsTocResultRepository.update(rptr.result_toc_result_id, {
        toc_result_id: toc_result_id,
        is_active: true,
        last_updated_by: user.id,
        planned_result: planned_result,
      });
    } else {
      await this._resultsTocResultRepository.save({
        version_id: version.id,
        results_id: rip.id,
        initiative_id: owner ? rip.initiative_id : initiative_id,
        toc_result_id: toc_result_id,
        planned_result: planned_result,
        last_updated_by: user.id,
        created_by: user.id,
      });
    }
  }

  async saveIpEoi(
    tocResultId: number,
    resultByInnovationPackageId: number,
    user: TokenDto,
    version: Version,
    result_toc_result: resultToResultInterfaceToc,
  ) {
    try {
      const searchTocResult = await this._resultsTocResultRepository.findOne({
        where: { toc_result_id: tocResultId, is_active: true },
      });

      if (!searchTocResult) {
        return {
          response: { valid: true },
          message: 'No End of Initiative Outcomes were found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const resultByInnoPckg = await this._ipsrRepository.findOne({
        where: {
          result_innovation_package_id: resultByInnovationPackageId,
          is_active: true,
          ipsr_role_id: 1,
        },
      });

      const searchIpEoi = await this._resultIpEoiOutcomesRepository.findOne({
        where: {
          result_by_innovation_package_id:
            resultByInnoPckg?.result_by_innovation_package_id,
          contributing_toc: true,
          is_active: true,
        },
      });

      if (result_toc_result['toc_level_id'] !== 3) {
        await this._resultIpEoiOutcomesRepository.update(
          searchIpEoi?.result_ip_eoi_outcome_id,
          {
            is_active: false,
            contributing_toc: false,
            last_updated_by: user.id,
          },
        );

        return {
          response: { valid: true },
          message: 'No End of Initiative Outcomes were saved',
          status: HttpStatus.OK,
        };
      }

      const searchContributingToc =
        await this._resultIpEoiOutcomesRepository.find({
          where: {
            result_by_innovation_package_id:
              resultByInnoPckg?.result_by_innovation_package_id,
            is_active: true,
            toc_result_id: tocResultId,
          },
        });

      const filterEoiToc = searchContributingToc.filter(
        (i) => i.toc_result_id !== searchIpEoi?.toc_result_id,
      );

      if (filterEoiToc.length) {
        await this._resultIpEoiOutcomesRepository.update(
          filterEoiToc[0].result_ip_eoi_outcome_id,
          {
            contributing_toc: true,
            last_updated_by: user.id,
          },
        );

        await this._resultIpEoiOutcomesRepository.update(
          searchIpEoi.result_ip_eoi_outcome_id,
          {
            is_active: false,
            contributing_toc: false,
            last_updated_by: user.id,
          },
        );

        return {
          response: { valid: true },
          message: 'The EOI have been updated',
          status: HttpStatus.OK,
        };
      } else {
        await this._resultIpEoiOutcomesRepository.save({
          toc_result_id: tocResultId,
          result_by_innovation_package_id:
            resultByInnoPckg?.result_by_innovation_package_id,
          created_by: user.id,
          last_updated_by: user.id,
          version_id: version.id,
          contributing_toc: true,
        });

        await this._resultIpEoiOutcomesRepository.update(
          searchIpEoi.result_ip_eoi_outcome_id,
          {
            is_active: false,
            contributing_toc: false,
            last_updated_by: user.id,
          },
        );
      }
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findOne(resultId: number) {
    try {
      const resultInit =
        await this._resultByInitiativesRepository.getOwnerInitiativeByResult(
          resultId,
        );
      const conInit =
        await this._resultByInitiativesRepository.getContributorInitiativeByResult(
          resultId,
        );
      const conPending =
        await this._resultByInitiativesRepository.getPendingInit(resultId);
      const npProject =
        await this._nonPooledProjectRepository.getAllNPProjectByResultId(
          resultId,
          1,
        );
      const resCenters =
        await this._resultsCenterRepository.getAllResultsCenterByResultId(
          resultId,
        );
      const institutions =
        await this._resultByIntitutionsRepository.getGenericAllResultByInstitutionByRole(
          resultId,
          2,
        );
      const deliveries =
        await this._resultByInstitutionsByDeliveriesTypeRepository.getDeliveryByResultByInstitution(
          institutions?.map((el) => el.id),
        );
      institutions.map((int) => {
        int['deliveries'] = deliveries
          .filter((del) => del.result_by_institution_id == int.id)
          .map((del) => del.partner_delivery_type_id);
      });
      let resTocRes: any[] = [];
      let conResTocRes: any[] = [];
      resTocRes = await this._resultsTocResultRepository.getRTRPrimary(
        resultId,
        [resultInit.id],
        true,
      );
      if (!resTocRes?.length) {
        resTocRes = [
          {
            action_area_outcome_id: null,
            toc_result_id: null,
            planned_result: null,
            results_id: resultId,
            initiative_id: resultInit.id,
            short_name: resultInit.short_name,
            official_code: resultInit.official_code,
          },
        ];
      }
      resTocRes[0]['toc_level_id'] =
        resTocRes[0]['planned_result'] != null &&
        resTocRes[0]['planned_result'] == 0
          ? 3
          : resTocRes[0]['toc_level_id'];
      conResTocRes = await this._resultsTocResultRepository.getRTRPrimary(
        resultId,
        [resultInit.id],
        false,
        conInit.map((el) => el.id),
      );
      conResTocRes.map((el) => {
        el['toc_level_id'] =
          el['planned_result'] == 0 && el['planned_result'] != null
            ? 3
            : el['toc_level_id'];
      });

      return {
        response: {
          contributing_initiatives: conInit,
          pending_contributing_initiatives: conPending,
          contributing_np_projects: npProject,
          contributing_center: resCenters,
          result_toc_result: resTocRes[0],
          contributors_result_toc_result: conResTocRes,
          institutions: institutions,
        },
        message: 'The toc data is successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }
}

interface resultToResultInterfaceToc {
  result_toc_result_id?: number;
  toc_result_id?: number;
  action_area_outcome_id?: number;
  results_id: number;
  planned_result: boolean;
  initiative_id: number;
}
