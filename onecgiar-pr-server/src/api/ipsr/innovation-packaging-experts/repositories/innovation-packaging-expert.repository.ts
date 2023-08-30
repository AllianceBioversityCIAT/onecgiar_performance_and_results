import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { InnovationPackagingExpert } from '../entities/innovation-packaging-expert.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class InnovationPackagingExpertRepository
  extends Repository<InnovationPackagingExpert>
  implements ReplicableInterface<InnovationPackagingExpert>
{
  constructor(
    private dataSource: DataSource,
    private _handlersError: HandlersError,
  ) {
    super(InnovationPackagingExpert, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    InnovationPackagingExpertRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<InnovationPackagingExpert>,
  ): Promise<InnovationPackagingExpert[]> {
    let final_data: InnovationPackagingExpert[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,rie.created_date
        ,rie.email
        ,rie.expertises_id
        ,rie.first_name
        ,rie.is_active
        ,rie.last_name
        ,? as last_updated_by
        ,rie.last_updated_date
        ,rie.organization_id
        ,? as result_id
         FROM result_ip_expert rie
         	WHERE rie.result_id = ? AND rie.is_active > 0
        `;
        const response = await (<Promise<InnovationPackagingExpert[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <InnovationPackagingExpert[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_ip_expert (
          created_by
          ,created_date
          ,email
          ,expertises_id
          ,first_name
          ,is_active
          ,last_name
          ,last_updated_by
          ,last_updated_date
          ,organization_id
          ,result_id
          )
          SELECT 
          ? as created_by
          ,rie.created_date
          ,rie.email
          ,rie.expertises_id
          ,rie.first_name
          ,rie.is_active
          ,rie.last_name
          ,? as last_updated_by
          ,rie.last_updated_date
          ,rie.organization_id
          ,? as result_id
           FROM result_ip_expert rie
           WHERE rie.result_id = ? AND rie.is_active > 0`;
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
        ,rie.email
        ,rie.expertises_id
        ,rie.first_name
        ,rie.is_active
        ,rie.last_name
        ,rie.last_updated_by
        ,rie.last_updated_date
        ,rie.organization_id
        ,rie.result_id
        ,rie.result_ip_expert_id
         FROM result_ip_expert rie
         	WHERE rie.result_id = ?
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
