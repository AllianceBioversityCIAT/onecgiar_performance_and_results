import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { ResultIpEoiOutcome } from '../entities/result-ip-eoi-outcome.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class ResultIpEoiOutcomeRepository
  extends Repository<ResultIpEoiOutcome>
  implements ReplicableInterface<ResultIpEoiOutcome>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultIpEoiOutcome, dataSource.createEntityManager());
  }
  private readonly _logger: Logger = new Logger(
    ResultIpEoiOutcomeRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultIpEoiOutcome>,
  ): Promise<ResultIpEoiOutcome> {
    let final_data: ResultIpEoiOutcome = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT rieoio.contributing_toc
        ,? as created_by
        ,rieoio.created_date
        ,rieoio.is_active
        ,? as last_updated_by
        ,rieoio.last_updated_date
        ,? as result_by_innovation_package_id
        ,rieoio.toc_result_id
         FROM result_ip_eoi_outcomes rieoio
         WHERE rieoio.result_by_innovation_package_id = ? and rieoio.is_active > 0`;
        const response = await (<Promise<ResultIpEoiOutcome[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultIpEoiOutcome>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        insert into \`result_answers\` (
          contributing_toc
          ,created_by
          ,created_date
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,result_by_innovation_package_id
          ,toc_result_id
          ) SELECT rieoio.contributing_toc
          ,? as created_by
          ,rieoio.created_date
          ,rieoio.is_active
          ,? as last_updated_by
          ,rieoio.last_updated_date
          ,? as result_by_innovation_package_id
          ,rieoio.toc_result_id
           FROM result_ip_eoi_outcomes rieoio
           WHERE rieoio.result_by_innovation_package_id = ? and rieoio.is_active > 0`;
        const response = await (<Promise<{ insertId }>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));

        const queryFind = `
        SELECT rieoio.contributing_toc
        ,rieoio.created_by
        ,rieoio.created_date
        ,rieoio.is_active
        ,rieoio.last_updated_by
        ,rieoio.last_updated_date
        ,rieoio.result_by_innovation_package_id
        ,rieoio.result_ip_eoi_outcome_id
        ,rieoio.toc_result_id
         FROM result_ip_eoi_outcomes rieoio
         WHERE rieoio.result_by_innovation_package_id = ?
        `;
        const temp = await (<Promise<ResultIpEoiOutcome[]>>(
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

  async getEoiOutcomes(resultByInnovationPackageId: number) {
    const query = `
    SELECT 
      rieo.toc_result_id,
      (
        SELECT
          tr.title
        FROM toc_result tr
        WHERE toc_result_id = rieo.toc_result_id
      ) AS title
    FROM
      result_ip_eoi_outcomes rieo
    WHERE rieo.is_active > 0
        AND result_by_innovation_package_id = ?
    `;

    try {
      const eoiOutcome: any[] = await this.query(query, [
        resultByInnovationPackageId,
      ]);
      return eoiOutcome;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultIpEoiOutcomeRepository.name,
        error: error,
        debug: true,
      });
    }
  }
}
