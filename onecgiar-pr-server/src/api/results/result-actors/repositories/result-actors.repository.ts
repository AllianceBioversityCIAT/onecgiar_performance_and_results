import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResultActor } from '../entities/result-actor.entity';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class ResultActorRepository
  extends Repository<ResultActor>
  implements ReplicableInterface<ResultActor>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultActor, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(ResultActorRepository.name);

  async replicable(
    config: ReplicableConfigInterface<ResultActor>,
  ): Promise<ResultActor> {
    let final_data: ResultActor = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ra.actor_type_id
        ,? as created_by
        ,ra.created_date
        ,ra.has_men
        ,ra.has_men_youth
        ,ra.has_women
        ,ra.has_women_youth
        ,ra.how_many
        ,ra.is_active
        ,? as last_updated_by
        ,ra.last_updated_date
        ,ra.men
        ,ra.men_youth
        ,ra.other_actor_type
        ,? as result_id
        ,ra.sex_and_age_disaggregation
        ,ra.women
        ,ra.women_youth
         FROM result_actors ra
         WHERE ra.result_id = ? and ra.is_active > 0`;
        const response = await (<Promise<ResultActor[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultActor>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_actors (
          actor_type_id
          ,created_by
          ,created_date
          ,has_men
          ,has_men_youth
          ,has_women
          ,has_women_youth
          ,how_many
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,men
          ,men_youth
          ,other_actor_type
          ,result_id
          ,sex_and_age_disaggregation
          ,women
          ,women_youth
          )
          SELECT 
          ra.actor_type_id
          ,? as created_by
          ,ra.created_date
          ,ra.has_men
          ,ra.has_men_youth
          ,ra.has_women
          ,ra.has_women_youth
          ,ra.how_many
          ,ra.is_active
          ,? as last_updated_by
          ,ra.last_updated_date
          ,ra.men
          ,ra.men_youth
          ,ra.other_actor_type
          ,? as result_id
          ,ra.sex_and_age_disaggregation
          ,ra.women
          ,ra.women_youth
           FROM result_actors ra
           WHERE ra.result_id = ? and ra.is_active > 0`;
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
        ra.actor_type_id
        ,ra.created_by
        ,ra.created_date
        ,ra.has_men
        ,ra.has_men_youth
        ,ra.has_women
        ,ra.has_women_youth
        ,ra.how_many
        ,ra.is_active
        ,ra.last_updated_by
        ,ra.last_updated_date
        ,ra.men
        ,ra.men_youth
        ,ra.other_actor_type
        ,ra.result_actors_id
        ,ra.result_id
        ,ra.sex_and_age_disaggregation
        ,ra.women
        ,ra.women_youth
         FROM result_actors ra
         WHERE ra.result_id = ?
          `;
        const temp = await (<Promise<ResultActor[]>>(
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
