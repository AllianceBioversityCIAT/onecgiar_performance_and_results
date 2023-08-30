import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { ResultInnovationPackage } from '../entities/result-innovation-package.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class ResultInnovationPackageRepository
  extends Repository<ResultInnovationPackage>
  implements ReplicableInterface<ResultInnovationPackage>
{
  constructor(
    private dataSource: DataSource,
    private _handlersError: HandlersError,
  ) {
    super(ResultInnovationPackage, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    ResultInnovationPackageRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultInnovationPackage>,
  ): Promise<ResultInnovationPackage> {
    let final_data: ResultInnovationPackage = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        rip.active_backstopping_id
        ,rip.assessed_during_expert_workshop_id
        ,rip.bilateral_expected_time
        ,rip.bilateral_unit_time_id
        ,rip.consensus_initiative_work_package_id
        ,? as created_by
        ,rip.created_date
        ,rip.experts_is_diverse
        ,rip.initiative_expected_time
        ,rip.initiative_unit_time_id
        ,rip.ipsr_pdf_report
        ,rip.is_active
        ,rip.is_expert_workshop_organized
        ,rip.is_not_diverse_justification
        ,rip.is_result_ip_published
        ,? as last_updated_by
        ,rip.last_updated_date
        ,rip.partner_expected_time
        ,rip.partner_unit_time_id
        ,rip.readiness_level_evidence_based
        ,rip.regional_integrated_id
        ,rip.regional_leadership_id
        ,rip.relevant_country_id
        ,? as result_innovation_package_id
        ,rip.scaling_ambition_blurb
        ,rip.use_level_evidence_based
         FROM result_innovation_package rip
         WHERE rip.result_innovation_package_id = ? AND rip.is_active > 0`;
        const response = await (<Promise<ResultInnovationPackage[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultInnovationPackage>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_innovation_package (
          active_backstopping_id
          ,assessed_during_expert_workshop_id
          ,bilateral_expected_time
          ,bilateral_unit_time_id
          ,consensus_initiative_work_package_id
          ,created_by
          ,created_date
          ,experts_is_diverse
          ,initiative_expected_time
          ,initiative_unit_time_id
          ,ipsr_pdf_report
          ,is_active
          ,is_expert_workshop_organized
          ,is_not_diverse_justification
          ,is_result_ip_published
          ,last_updated_by
          ,last_updated_date
          ,partner_expected_time
          ,partner_unit_time_id
          ,readiness_level_evidence_based
          ,regional_integrated_id
          ,regional_leadership_id
          ,relevant_country_id
          ,result_innovation_package_id
          ,scaling_ambition_blurb
          ,use_level_evidence_based
          )
          SELECT 
          rip.active_backstopping_id
          ,rip.assessed_during_expert_workshop_id
          ,rip.bilateral_expected_time
          ,rip.bilateral_unit_time_id
          ,rip.consensus_initiative_work_package_id
          ,? as created_by
          ,rip.created_date
          ,rip.experts_is_diverse
          ,rip.initiative_expected_time
          ,rip.initiative_unit_time_id
          ,rip.ipsr_pdf_report
          ,rip.is_active
          ,rip.is_expert_workshop_organized
          ,rip.is_not_diverse_justification
          ,rip.is_result_ip_published
          ,? as last_updated_by
          ,rip.last_updated_date
          ,rip.partner_expected_time
          ,rip.partner_unit_time_id
          ,rip.readiness_level_evidence_based
          ,rip.regional_integrated_id
          ,rip.regional_leadership_id
          ,rip.relevant_country_id
          ,? as result_innovation_package_id
          ,rip.scaling_ambition_blurb
          ,rip.use_level_evidence_based
           FROM result_innovation_package rip
           WHERE rip.result_innovation_package_id = ? AND rip.is_active > 0`;
        const response = await (<Promise<{ insertId }>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));

        const queryFind = `
        SELECT 
        rip.active_backstopping_id
        ,rip.assessed_during_expert_workshop_id
        ,rip.bilateral_expected_time
        ,rip.bilateral_unit_time_id
        ,rip.consensus_initiative_work_package_id
        ,rip.created_by
        ,rip.created_date
        ,rip.experts_is_diverse
        ,rip.initiative_expected_time
        ,rip.initiative_unit_time_id
        ,rip.ipsr_pdf_report
        ,rip.is_active
        ,rip.is_expert_workshop_organized
        ,rip.is_not_diverse_justification
        ,rip.is_result_ip_published
        ,rip.last_updated_by
        ,rip.last_updated_date
        ,rip.partner_expected_time
        ,rip.partner_unit_time_id
        ,rip.readiness_level_evidence_based
        ,rip.regional_integrated_id
        ,rip.regional_leadership_id
        ,rip.relevant_country_id
        ,rip.result_innovation_package_id
        ,rip.scaling_ambition_blurb
        ,rip.use_level_evidence_based
         FROM result_innovation_package rip
         WHERE rip.result_innovation_package_id = ? AND rip.is_active > 0
          `;
        const temp = await (<Promise<ResultInnovationPackage[]>>(
          this.query(queryFind, [config.new_result_id])
        ));
        final_data = temp?.length ? temp[0] : null;
      }
    } catch (error) {
      config.f?.errorFunction
        ? config.f.errorFunction(error)
        : this._logger.error(error);
      final_data = null;
    }

    config.f?.completeFunction
      ? config.f.completeFunction({ ...final_data })
      : null;
    return final_data;
  }
}
