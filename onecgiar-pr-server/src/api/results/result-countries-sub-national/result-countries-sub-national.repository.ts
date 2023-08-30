import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { ResultCountriesSubNational } from './entities/result-countries-sub-national.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class ResultCountriesSubNationalRepository
  extends Repository<ResultCountriesSubNational>
  implements ReplicableInterface<ResultCountriesSubNational>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultCountriesSubNational, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    ResultCountriesSubNationalRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultCountriesSubNational>,
  ): Promise<ResultCountriesSubNational[]> {
    let final_data: ResultCountriesSubNational[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT
        ? as created_by
        ,rcsn.created_date
        ,rcsn.is_active
        ,? as last_updated_by
        ,rcsn.last_updated_date
        ,rc2.result_country_id AS result_countries_id
        ,rcsn.sub_level_one_id
        ,rcsn.sub_level_one_name
        ,rcsn.sub_level_two_id
        ,rcsn.sub_level_two_name
         FROM result_countries_sub_national rcsn
        	INNER JOIN result_country rc ON rc.result_country_id = rcsn.result_countries_id 
        								AND rc.is_active > 0
         	INNER JOIN result_country rc2 ON rc2.country_id = rc.country_id 	
         								AND rc2.result_id = ?
         								AND rc2.is_active > 0
        WHERE rcsn.is_active > 0
        	AND rc.result_id = ?;
        `;
        const response = await (<Promise<ResultCountriesSubNational[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultCountriesSubNational[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO result_countries_sub_national (
          created_by
          ,created_date
          ,is_active
          ,last_updated_by
          ,last_updated_date
          ,result_countries_id
          ,sub_level_one_id
          ,sub_level_one_name
          ,sub_level_two_id
          ,sub_level_two_name
          )
          SELECT 
          ? as created_by
          ,rcsn.created_date
          ,rcsn.is_active
          ,? as last_updated_by
          ,rcsn.last_updated_date
          ,rc2.result_country_id AS result_countries_id
          ,rcsn.sub_level_one_id
          ,rcsn.sub_level_one_name
          ,rcsn.sub_level_two_id
          ,rcsn.sub_level_two_name
           FROM result_countries_sub_national rcsn
             INNER JOIN result_country rc ON rc.result_country_id = rcsn.result_countries_id 
                          AND rc.is_active > 0
             INNER JOIN result_country rc2 ON rc2.country_id = rc.country_id 	
                           AND rc2.result_id = ?
                           AND rc2.is_active > 0
          WHERE rcsn.is_active > 0
            AND rc.result_id = ?;`;
        await this.query(queryData, [
          config.user.id,
          config.user.id,
          config.new_result_id,
          config.old_result_id,
        ]);
        const queryFind = `
        SELECT
        rcsn.created_by
        ,rcsn.created_date
        ,rcsn.is_active
        ,rcsn.last_updated_by
        ,rcsn.last_updated_date
        ,rcsn.result_countries_id
        ,rcsn.result_countries_sub_national_id
        ,rcsn.sub_level_one_id
        ,rcsn.sub_level_one_name
        ,rcsn.sub_level_two_id
        ,rcsn.sub_level_two_name
         FROM result_countries_sub_national rcsn
        	INNER JOIN result_country rc ON rc.result_country_id = rcsn.result_countries_id 
        								AND rc.is_active > 0
        WHERE rcsn.is_active > 0
        	AND rc.result_id = ?;
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

  async inactiveAllIds(result_countries_id: number[]): Promise<void> {
    try {
      const inactiveQuery = `
        UPDATE
          result_countries_sub_national
        set
          is_active = FALSE
        WHERE
          result_countries_id in (${
            result_countries_id?.length ? result_countries_id.toString() : null
          });
        `;
      await this.query(inactiveQuery);
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultCountriesSubNationalRepository.name,
        error: error,
        debug: true,
      });
    }
  }
}
