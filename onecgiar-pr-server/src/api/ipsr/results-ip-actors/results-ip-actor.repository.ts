import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { ResultsIpActor } from './entities/results-ip-actor.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../shared/globalInterfaces/replicable.interface';
import { VERSIONING } from '../../../shared/utils/versioning.utils';

@Injectable()
export class ResultsIpActorRepository
  extends Repository<ResultsIpActor>
  implements ReplicableInterface<ResultsIpActor>
{
  constructor(
    private dataSource: DataSource,
    private _handlersError: HandlersError,
  ) {
    super(ResultsIpActor, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(ResultsIpActorRepository.name);

  async replicable(
    config: ReplicableConfigInterface<ResultsIpActor>,
  ): Promise<ResultsIpActor> {
    let final_data: ResultsIpActor = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        rira.actor_type_id
        ,? as created_by
        ,rira.created_date
        ,rira.evidence_link
        ,rira.how_many
        ,rira.is_active
        ,? as last_updated_by
        ,rira.last_updated_date
        ,rira.men
        ,rira.men_youth
        ,rira.other_actor_type
        ,${VERSIONING.QUERY.Get_r_ip_r_id()} as result_ip_result_id
        ,rira.sex_and_age_disaggregation
        ,rira.women
        ,rira.women_youth
         FROM result_ip_result_actors rira
         NNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = rira.result_ip_result_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND rira.is_active  > 0
         	AND rbip.ipsr_role_id = 1;`;
        const response = await (<Promise<ResultsIpActor[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultsIpActor>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_ip_result_actors (
          actor_type_id
          ,created_by
          ,created_date
          ,evidence_link
          ,how_many
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,men
          ,men_youth
          ,other_actor_type
          ,result_ip_result_id
          ,sex_and_age_disaggregation
          ,women
          ,women_youth
          )
          SELECT 
          rira.actor_type_id
          ,? as created_by
          ,rira.created_date
          ,rira.evidence_link
          ,rira.how_many
          ,rira.is_active
          ,? as last_updated_by
          ,rira.last_updated_date
          ,rira.men
          ,rira.men_youth
          ,rira.other_actor_type
          ,${VERSIONING.QUERY.Get_r_ip_r_id()} as result_ip_result_id
          ,rira.sex_and_age_disaggregation
          ,rira.women
          ,rira.women_youth
           FROM result_ip_result_actors rira
           NNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = rira.result_ip_result_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND rira.is_active  > 0
         	AND rbip.ipsr_role_id = 1;`;
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
         NNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = rira.result_ip_result_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND rira.is_active  > 0
         	AND rbip.ipsr_role_id = 1;
          `;
        const temp = await (<Promise<ResultsIpActor[]>>(
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
