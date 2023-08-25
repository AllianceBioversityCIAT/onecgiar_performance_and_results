import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { ResultIpAAOutcome } from '../entities/result-ip-action-area-outcome.entity';
import { env } from 'process';
import { ResultIpExpertWorkshopOrganized } from '../entities/result-ip-expert-workshop-organized.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class ResultIpExpertWorkshopOrganizedRepostory
  extends Repository<ResultIpExpertWorkshopOrganized>
  implements ReplicableInterface<ResultIpExpertWorkshopOrganized>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultIpExpertWorkshopOrganized, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    ResultIpExpertWorkshopOrganizedRepostory.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultIpExpertWorkshopOrganized>,
  ): Promise<ResultIpExpertWorkshopOrganized> {
    let final_data: ResultIpExpertWorkshopOrganized = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,riewo.created_date
        ,riewo.email
        ,riewo.first_name
        ,riewo.is_active
        ,riewo.last_name
        ,? as last_updated_by
        ,riewo.last_updated_date
        ,? as result_id
        ,riewo.workshop_role
         FROM result_ip_expert_workshop_organized riewo
         WHERE riewo.result_id  = ? and riewo.is_active  > 0;`;
        const response = await (<Promise<ResultIpExpertWorkshopOrganized[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultIpExpertWorkshopOrganized>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_ip_expert_workshop_organized (
          created_by
          ,created_date
          ,email
          ,first_name
          ,is_active
          ,last_name
          ,last_updated_by
          ,last_updated_date
          ,result_id
          ,workshop_role
          )
          SELECT 
          ? as created_by
          ,riewo.created_date
          ,riewo.email
          ,riewo.first_name
          ,riewo.is_active
          ,riewo.last_name
          ,? as last_updated_by
          ,riewo.last_updated_date
          ,? as result_id
          ,riewo.workshop_role
           FROM result_ip_expert_workshop_organized riewo
           WHERE riewo.result_id  = ? and riewo.is_active  > 0;`;
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
        riewo.created_by
        ,riewo.created_date
        ,riewo.email
        ,riewo.first_name
        ,riewo.is_active
        ,riewo.last_name
        ,riewo.last_updated_by
        ,riewo.last_updated_date
        ,riewo.result_id
        ,riewo.result_ip_expert_workshop_organized_id
        ,riewo.workshop_role
         FROM result_ip_expert_workshop_organized riewo
         WHERE riewo.result_id  = ?;
        `;
        const temp = await (<Promise<ResultIpExpertWorkshopOrganized[]>>(
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
