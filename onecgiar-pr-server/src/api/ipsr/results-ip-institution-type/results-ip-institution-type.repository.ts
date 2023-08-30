import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { ResultsIpInstitutionType } from './entities/results-ip-institution-type.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../shared/globalInterfaces/replicable.interface';
import { VERSIONING } from '../../../shared/utils/versioning.utils';

@Injectable()
export class ResultsIpInstitutionTypeRepository
  extends Repository<ResultsIpInstitutionType>
  implements ReplicableInterface<ResultsIpInstitutionType>
{
  constructor(
    private dataSource: DataSource,
    private _handlersError: HandlersError,
  ) {
    super(ResultsIpInstitutionType, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    ResultsIpInstitutionTypeRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultsIpInstitutionType>,
  ): Promise<ResultsIpInstitutionType[]> {
    let final_data: ResultsIpInstitutionType[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,ririt.created_date
        ,ririt.evidence_link
        ,ririt.graduate_students
        ,ririt.how_many
        ,ririt.institution_roles_id
        ,ririt.institution_types_id
        ,ririt.is_active
        ,? as last_updated_by
        ,ririt.last_updated_date
        ,ririt.other_institution
        ,${VERSIONING.QUERY.Get_r_ip_r_id()} as result_ip_results_id
         FROM result_ip_result_institution_types ririt
         INNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = ririt.result_ip_results_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND ririt.is_active  > 0
         	AND rbip.ipsr_role_id = 1;
 
        `;
        const response = await (<Promise<ResultsIpInstitutionType[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultsIpInstitutionType[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_ip_result_institution_types (
          created_by
          ,created_date
          ,evidence_link
          ,graduate_students
          ,how_many
          ,institution_roles_id
          ,institution_types_id
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,other_institution
          ,result_ip_results_id
          )
          SELECT 
          ? as created_by
          ,ririt.created_date
          ,ririt.evidence_link
          ,ririt.graduate_students
          ,ririt.how_many
          ,ririt.institution_roles_id
          ,ririt.institution_types_id
          ,ririt.is_active
          ,? as last_updated_by
          ,ririt.last_updated_date
          ,ririt.other_institution
          ,${VERSIONING.QUERY.Get_r_ip_r_id()} as result_ip_results_id
           FROM result_ip_result_institution_types ririt
           INNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = ririt.result_ip_results_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND ririt.is_active  > 0
         	AND rbip.ipsr_role_id = 1;`;
        await this.query(queryData, [
          config.user.id,
          config.user.id,
          config.new_result_id,
          config.old_result_id,
        ]);
        const queryFind = `
        SELECT 
        ririt.created_by
        ,ririt.created_date
        ,ririt.evidence_link
        ,ririt.graduate_students
        ,ririt.how_many
        ,ririt.id
        ,ririt.institution_roles_id
        ,ririt.institution_types_id
        ,ririt.is_active
        ,ririt.last_updated_by
        ,ririt.last_updated_date
        ,ririt.other_institution
        ,ririt.result_ip_results_id
         FROM result_ip_result_institution_types ririt
         INNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = ririt.result_ip_results_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND ririt.is_active  > 0
         	AND rbip.ipsr_role_id = 1;
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
