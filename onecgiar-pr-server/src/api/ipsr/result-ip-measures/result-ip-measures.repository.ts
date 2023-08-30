import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResultIpMeasure } from './entities/result-ip-measure.entity';
import { HandlersError } from '../../../shared/handlers/error.utils';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class ResultIpMeasureRepository
  extends Repository<ResultIpMeasure>
  implements ReplicableInterface<ResultIpMeasure>
{
  constructor(
    private dataSource: DataSource,
    private _handlersError: HandlersError,
  ) {
    super(ResultIpMeasure, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(ResultIpMeasureRepository.name);

  async replicable(
    config: ReplicableConfigInterface<ResultIpMeasure>,
  ): Promise<ResultIpMeasure[]> {
    let final_data: ResultIpMeasure[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,rie.created_date
        ,rie.expertises_id
        ,rie.is_active
        ,? as last_updated_by
        ,rie.last_updated_date
        ,rie3.result_ip_expert_id
         FROM result_ip_expertises rie
         	INNER JOIN result_ip_expert rie2 ON rie2.result_ip_expert_id = rie.result_ip_expert_id 
         									AND rie2.is_active > 0
         	INNER JOIN result_ip_expert rie3 ON rie3.organization_id = rie2.organization_id 
         									AND rie3.first_name = rie2.first_name 
         									AND rie3.last_name = rie2.last_name
         									AND rie3.result_id = ?
         WHERE rie.is_active > 0
         	AND rie2.result_id = ?
        `;
        const response = await (<Promise<ResultIpMeasure[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultIpMeasure[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_ip_expertises (
          created_by
          ,created_date
          ,expertises_id
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,result_ip_expert_id
          )
          SELECT 
          ? as created_by
          ,rie.created_date
          ,rie.expertises_id
          ,rie.is_active
          ,? as last_updated_by
          ,rie.last_updated_date
          ,rie3.result_ip_expert_id 
           FROM result_ip_expertises rie
             INNER JOIN result_ip_expert rie2 ON rie2.result_ip_expert_id = rie.result_ip_expert_id 
                             AND rie2.is_active > 0
             INNER JOIN result_ip_expert rie3 ON rie3.organization_id = rie2.organization_id 
                             AND rie3.first_name = rie2.first_name 
                             AND rie3.last_name = rie2.last_name
                             AND rie3.result_id = ?
           WHERE rie.is_active > 0
             AND rie2.result_id = ?`;
        await this.query(queryData, [
          config.user.id,
          config.user.id,
          config.new_result_id,
          config.old_result_id,
        ]);
        const queryFind = `
        SELECT 
        rie.created_by
        ,rie.created_date
        ,rie.expertises_id
        ,rie.is_active
        ,rie.last_updated_by
        ,rie.last_updated_date
        ,rie.result_ip_expert_id
        ,rie.result_ip_expertises_id
         FROM result_ip_expertises rie
         	INNER JOIN result_ip_expert rie2 ON rie2.result_ip_expert_id = rie.result_ip_expert_id 
         									AND rie2.is_active > 0
         WHERE rie.is_active > 0
         	AND rie2.result_id = ?
        `;
        final_data = await this.query(queryFind, [config.new_result_id]);
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
