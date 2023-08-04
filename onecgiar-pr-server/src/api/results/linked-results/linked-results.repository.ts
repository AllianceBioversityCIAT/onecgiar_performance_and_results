import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { LinkedResult } from './entities/linked-result.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../shared/globalInterfaces/replicable.interface';
import { VERSIONING } from '../../../shared/utils/versioning.utils';

@Injectable()
export class LinkedResultRepository
  extends Repository<LinkedResult>
  implements ReplicableInterface<LinkedResult>
{
  private readonly _logger: Logger = new Logger(LinkedResultRepository.name);

  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(LinkedResult, dataSource.createEntityManager());
  }
  async replicable(
    config: ReplicableConfigInterface<LinkedResult>,
  ): Promise<LinkedResult[]> {
    let final_data: LinkedResult[] = null;
    try {
      if (config.f?.custonFunction) {
        const response = await this.find({
          where: { origin_result_id: config.old_result_id, is_active: true },
        });
        response.map((el) => {
          delete el.id;
          delete el.created_date;
          delete el.last_updated_date;
          el.origin_result_id = config.new_result_id;
        });
        const response_edit = <LinkedResult[]>config.f.custonFunction(response);
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        insert into linked_result (
          is_active,
          created_date,
          last_updated_date,
          linked_results_id,
          origin_result_id,
          created_by,
          last_updated_by,
          legacy_link
          )
          select
          lr.is_active,
          now() as created_date,
          null as last_updated_date,
          ${VERSIONING.QUERY.Get_result_phases(
            `lr.linked_results_id`,
            config.phase,
          )} as linked_results_id,
          ? as origin_result_id,
          lr.created_by,
          lr.last_updated_by,
          lr.legacy_link
          from linked_result lr WHERE lr.origin_result_id = ? and is_active > 0`;
        await this.query(queryData, [
          config.new_result_id,
          config.phase,
          config.old_result_id,
        ]);
        final_data = await this.find({
          where: {
            origin_result_id: config.new_result_id,
          },
        });
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

  async deleteAllData() {
    const queryData = `
    DELETE FROM linked_result;
    `;
    try {
      await this.query(queryData);
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: LinkedResultRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async getLinkResultByIdResultAndLinkId(resultId: number, link: number) {
    const query = `
    select 
    lr.id,
    lr.is_active,
    lr.created_date,
    lr.last_updated_date,
    lr.linked_results_id,
    lr.origin_result_id,
    lr.created_by,
    lr.last_updated_by,
    lr.legacy_link
    from linked_result lr 
    where lr.origin_result_id = ?
    	and lr.linked_results_id = ?;
    `;

    try {
      const linked: LinkedResult[] = await this.query(query, [resultId, link]);
      return linked?.length ? linked[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: LinkedResultRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async getLinkResultByIdResultAndLegacyLinkId(resultId: number, link: string) {
    const query = `
    select 
    lr.id,
    lr.is_active,
    lr.created_date,
    lr.last_updated_date,
    lr.linked_results_id,
    lr.origin_result_id,
    lr.created_by,
    lr.last_updated_by,
    lr.legacy_link
    from linked_result lr 
    where lr.origin_result_id = ?
    	and lr.legacy_link = ?;
    `;

    try {
      const linked: LinkedResult[] = await this.query(query, [resultId, link]);
      return linked?.length ? linked[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: LinkedResultRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async getMostUpDateResult(result_code: number) {
    const query = `
    select * from (SELECT 
      r2.id,
      if(r2.version_id  = (select max(r3.version_id) 
            from \`result\` r3 
            where r3.result_code = r2.result_code),1,0) +
      if(r2.status_id = 3,1,0) as max_data
    FROM \`result\` r2 
    WHERE r2.result_code = ?) f;
    `;
    try {
      const result: { id: number; max_data: number }[] = await this.query(
        query,
        [result_code],
      );
      const largestObject = result.reduce((acc, obj) => {
        if (obj.max_data > acc.max_data) {
          return obj;
        } else {
          return acc;
        }
      });
      return largestObject?.id ? largestObject.id : null;
    } catch (error) {
      return null;
    }
  }

  async getLinkResultByIdResult(resultId: number) {
    const query = `
    select 
    lr.id as link_result_id,
    lr.is_active,
    lr.created_date,
    lr.last_updated_date,
    lr.linked_results_id as id,
    lr.origin_result_id,
    lr.created_by,
    lr.last_updated_by,
    r.description,
    r.is_active,
    r.last_updated_date,
    r.gender_tag_level_id,
    r.result_type_id,
    r.status,
    r.status_id,
    rs.status_name,
    r.created_by,
    r.last_updated_by,
    r.reported_year_id,
    r.created_date,
    r.result_level_id,
    r.title,
    r.legacy_id,
    r.no_applicable_partner,
    r.geographic_scope_id,
    rl.name as result_level,
    rt.name as result_type,
    r.has_regions,
    r.has_countries,
    lr.legacy_link,
    v.id as phase_id,
    v.phase_name,
    rs.status_name
  from linked_result lr 
  	left join \`result\` r on r.id  = lr.linked_results_id 
    left join result_level rl on rl.id = r.result_level_id 
    left join result_type rt on rt.id = r.result_type_id 
    INNER JOIN result_status rs ON rs.result_status_id = r.status_id  
    inner join \`version\` v on v.id = r.version_id 
    where lr.origin_result_id = ?
          and lr.is_active > 0;
    `;

    try {
      const linked: LinkedResult[] = await this.query(query, [resultId]);
      return linked;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: LinkedResultRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async updateLink(
    resultId: number,
    resultsArray: number[],
    legacyLinkArray: string[],
    userId: number,
    isLegacy: boolean,
  ) {
    const results = resultsArray ?? [];
    const legacy = legacyLinkArray ?? [];
    const upDateInactive = `
    update linked_result  
      set is_active = 0, 
        last_updated_date = NOW(),
        last_updated_by = ?
      where is_active > 0 
        and origin_result_id = ?
        ${
          resultsArray?.reduce((acum, val) => acum + val, 0) > 0 && !isLegacy
            ? `and linked_results_id not in (${
                !results.length ? `''` : results.toString()
              })`
            : `and legacy_link not in (${`'${legacy
                .toString()
                .replace(/,/g, "','")}'`})`
        }
        ;
    `;

    const upDateActive = `
    update linked_result  
      set is_active = 1, 
        last_updated_date = NOW(),
        last_updated_by = ?
      where origin_result_id = ?
      ${
        resultsArray?.reduce((acum, val) => acum + val, 0) > 0 && !isLegacy
          ? `and linked_results_id in (${
              !results.length ? `''` : results.toString()
            })`
          : `and legacy_link in (${`'${legacy
              .toString()
              .replace(/,/g, "','")}'`})`
      }
        ;
    `;

    const upDateAllInactive = `
    update linked_result  
      set is_active = 0, 
        last_updated_date = NOW(),
        last_updated_by = ?
      where is_active > 0 
      and origin_result_id = ?;
    `;

    try {
      if (results?.length || legacy?.length) {
        const upDateInactiveResult = await this.query(upDateInactive, [
          userId,
          resultId,
        ]);

        return await this.query(upDateActive, [userId, resultId]);
      } else {
        return await this.query(upDateAllInactive, [userId, resultId]);
      }
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: LinkedResultRepository.name,
        error: `updateLinks ${error}`,
        debug: true,
      });
    }
  }
}
