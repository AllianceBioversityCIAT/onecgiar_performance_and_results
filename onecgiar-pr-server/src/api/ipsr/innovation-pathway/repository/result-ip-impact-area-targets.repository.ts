import { Injectable, Logger } from '@nestjs/common';
import { HandlersError } from 'src/shared/handlers/error.utils';
import { DataSource, Repository } from 'typeorm';
import { ResultIpImpactArea } from '../entities/result-ip-impact-area.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';
import { VERSIONING } from '../../../../shared/utils/versioning.utils';

@Injectable()
export class ResultIpImpactAreaRepository
  extends Repository<ResultIpImpactArea>
  implements ReplicableInterface<ResultIpImpactArea>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultIpImpactArea, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    ResultIpImpactAreaRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultIpImpactArea>,
  ): Promise<ResultIpImpactArea> {
    let final_data: ResultIpImpactArea = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,riit.created_date
        ,riit.impact_area_indicator_id
        ,riit.is_active
        ,? as last_updated_by
        ,riit.last_updated_date
        ,${VERSIONING.QUERY.Get_r_ip_r_id()} as result_by_innovation_package_id
         FROM result_ip_impact_area_target riit
         INNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = riit.result_by_innovation_package_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND riit.is_active  > 0
         	AND rbip.ipsr_role_id = 1;`;
        const response = await (<Promise<ResultIpImpactArea[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultIpImpactArea>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_ip_impact_area_target (
          created_by
          ,created_date
          ,impact_area_indicator_id
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,result_by_innovation_package_id
          )
          SELECT 
          ? as created_by
          ,riit.created_date
          ,riit.impact_area_indicator_id
          ,riit.is_active
          ,? as last_updated_by
          ,riit.last_updated_date
          ,${VERSIONING.QUERY.Get_r_ip_r_id()} as result_by_innovation_package_id
           FROM result_ip_impact_area_target riit
           INNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = riit.result_by_innovation_package_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND riit.is_active  > 0
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
        riit.created_by
        ,riit.created_date
        ,riit.impact_area_indicator_id
        ,riit.is_active
        ,riit.last_updated_by
        ,riit.last_updated_date
        ,riit.result_by_innovation_package_id
        ,riit.result_ip_eoi_outcome_id
         FROM result_ip_impact_area_target riit
         INNER JOIN result_by_innovation_package rbip ON rbip.result_by_innovation_package_id = riit.result_by_innovation_package_id  
         												AND rbip.is_active > 0
         WHERE rbip.result_innovation_package_id = ? 
         	AND riit.is_active  > 0
         	AND rbip.ipsr_role_id = 1;
          `;
        const temp = await (<Promise<ResultIpImpactArea[]>>(
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

  async getImpactAreas(resultByInnovationPackageId: number) {
    const query = `
        SELECT 
            riia.impact_area_indicator_id AS targetId,
            cia.name,
            cgt.target
        FROM
            result_ip_impact_area_target riia
            LEFT JOIN clarisa_global_targets cgt ON cgt.targetId = riia.impact_area_indicator_id
            LEFT JOIN clarisa_impact_areas cia ON cia.id = cgt.impactAreaId
        WHERE riia.is_active  > 0
            AND riia.result_by_innovation_package_id = ?;
        `;

    try {
      const impactAreas: any[] = await this.query(query, [
        resultByInnovationPackageId,
      ]);
      return impactAreas;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultIpImpactAreaRepository.name,
        error: error,
        debug: true,
      });
    }
  }
}
