import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { ResultInitiativeBudget } from '../entities/result_initiative_budget.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';
import { predeterminedDateValidation } from '../../../../shared/utils/versioning.utils';
import { LogicalDelete } from '../../../../shared/globalInterfaces/delete.interface';

@Injectable()
export class ResultInitiativeBudgetRepository
  extends Repository<ResultInitiativeBudget>
  implements
    ReplicableInterface<ResultInitiativeBudget>,
    LogicalDelete<ResultInitiativeBudget>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultInitiativeBudget, dataSource.createEntityManager());
  }

  logicalDelete(resultId: number): Promise<ResultInitiativeBudget> {
    const queryData = `update result_initiative_budget rib 
    inner join results_by_inititiative rbi on rbi.id = result_initiative_budget_id 
    set rib.is_active = 0
    where rbi.result_id = ?;`;
    return this.query(queryData, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          error: err,
          className: ResultInitiativeBudgetRepository.name,
          debug: true,
        }),
      );
  }
  fisicalDelete(resultId: number): Promise<any> {
    const queryData = `
    delete rib from result_initiative_budget rib 
    inner join results_by_inititiative rbi on rbi.id = result_initiative_budget_id 
    where rbi.result_id = ?;`;
    return this.query(queryData, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          error: err,
          className: ResultInitiativeBudgetRepository.name,
          debug: true,
        }),
      );
  }

  private readonly _logger: Logger = new Logger(
    ResultInitiativeBudgetRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<ResultInitiativeBudget>,
  ): Promise<ResultInitiativeBudget[]> {
    let final_data: ResultInitiativeBudget[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,${predeterminedDateValidation(
          config?.predetermined_date,
        )} as created_date
        ,rib.current_year
        ,1 as is_active
        ,rib.is_determined
        ,rib.kind_cash
        ,? as last_updated_by
        ,rib.last_updated_date
        ,rib.next_year
        ,rbi2.id as result_initiative_id
         FROM results_by_inititiative rbi
          left join result_initiative_budget rib ON rbi.id = rib.result_initiative_id 
          										AND rbi.is_active > 0
          left join \`result\` r on r.id = rbi.result_id 
          						and r.is_active > 0
          left join \`result\` r2 on r2.result_code = r.result_code 
          left join results_by_inititiative rbi2 on rbi2.inititiative_id = rbi.inititiative_id 
          										and rbi2.initiative_role_id = rbi.initiative_role_id 
          										and rbi2.is_active > 0
          										and rbi2.result_id = r2.id 
        WHERE r2.id = ?
        	 and r.id = ?;
        `;
        const response = await (<Promise<ResultInitiativeBudget[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <ResultInitiativeBudget[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData = `
        INSERT INTO result_initiative_budget (
          created_date
          ,created_by
          ,current_year
          ,is_active
          ,is_determined
          ,kind_cash
          ,last_updated_by
          ,last_updated_date
          ,next_year
          ,result_initiative_id
          )
          SELECT 
          ${predeterminedDateValidation(
            config?.predetermined_date,
          )} as created_date
          ,? as created_by
          ,rib.current_year
          ,1 as is_active
          ,rib.is_determined
          ,rib.kind_cash
          ,? as last_updated_by
          ,rib.last_updated_date
          ,rib.next_year
          ,rbi2.id as result_initiative_id
           FROM results_by_inititiative rbi
            left join result_initiative_budget rib ON rbi.id = rib.result_initiative_id 
                                AND rbi.is_active > 0
            left join \`result\` r on r.id = rbi.result_id 
                        and r.is_active > 0
            left join \`result\` r2 on r2.result_code = r.result_code 
            left join results_by_inititiative rbi2 on rbi2.inititiative_id = rbi.inititiative_id 
                                and rbi2.initiative_role_id = rbi.initiative_role_id 
                                and rbi2.is_active > 0
                                and rbi2.result_id = r2.id 
          WHERE r2.id = ?
             and r.id = ?;`;
        await this.query(queryData, [
          config.user.id,
          config.user.id,
          config.new_result_id,
          config.old_result_id,
        ]);
        const queryFind = `
        SELECT 
        rib.created_by
        ,rib.created_date
        ,rib.current_year
        ,rib.is_active
        ,rib.is_determined
        ,rib.kind_cash
        ,rib.last_updated_by
        ,rib.last_updated_date
        ,rib.next_year
        ,rib.result_initiative_budget_id
        ,rib.result_initiative_id
         FROM result_initiative_budget rib
         	inner join results_by_inititiative rbi on rbi.id = rib.result_initiative_id 
         where rbi.result_id = ? 
        `;
        final_data = await this.query(queryFind, [config.new_result_id]);
      }
    } catch (error) {
      config.f?.errorFunction
        ? config.f.errorFunction(error)
        : this._logger.error(error);
      final_data = null;
    }

    config.f?.completeFunction?.({ ...final_data });

    return final_data;
  }
}
