import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { NonPooledProjectBudget } from '../entities/non_pooled_proyect_budget.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class NonPooledProjectBudgetRepository
  extends Repository<NonPooledProjectBudget>
  implements ReplicableInterface<NonPooledProjectBudget>
{
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(NonPooledProjectBudget, dataSource.createEntityManager());
  }

  private readonly _logger: Logger = new Logger(
    NonPooledProjectBudgetRepository.name,
  );

  async replicable(
    config: ReplicableConfigInterface<NonPooledProjectBudget>,
  ): Promise<NonPooledProjectBudget[]> {
    let final_data: NonPooledProjectBudget[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        SELECT 
        ? as created_by
        ,nppb.created_date
        ,nppb.in_cash
        ,nppb.in_kind
        ,nppb.is_active
        ,nppb.is_determined
        ,? as last_updated_by
        ,nppb.last_updated_date
        ,npp2.id as non_pooled_projetct_id
         FROM non_pooled_projetct_budget nppb
         	INNER JOIN non_pooled_project npp ON npp.id = nppb.non_pooled_projetct_id 
         									AND	npp.is_active > 0
         	INNER JOIN non_pooled_project npp2 ON npp2.grant_title = npp.grant_title 
         									AND npp2.grant_title = npp.grant_title 
         									AND npp2.lead_center_id = npp.lead_center_id 
         									AND npp2.results_id = ?
         WHERE npp.results_id = ?
         		AND nppb.is_active > 0
 
        `;
        const response = await (<Promise<NonPooledProjectBudget[]>>(
          this.query(queryData, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <NonPooledProjectBudget[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        INSERT INTO non_pooled_projetct_budget (
          created_by
          ,created_date
          ,in_cash
          ,in_kind
          ,is_active
          ,is_determined
          ,last_updated_by
          ,last_updated_date
          ,non_pooled_projetct_id
          )
          SELECT 
          ? as created_by
          ,nppb.created_date
          ,nppb.in_cash
          ,nppb.in_kind
          ,nppb.is_active
          ,nppb.is_determined
          ,? as last_updated_by
          ,nppb.last_updated_date
          ,npp2.id as non_pooled_projetct_id
           FROM non_pooled_projetct_budget nppb
           INNER JOIN non_pooled_project npp ON npp.id = nppb.non_pooled_projetct_id 
                      AND	npp.is_active > 0
           INNER JOIN non_pooled_project npp2 ON npp2.grant_title = npp.grant_title 
                      AND npp2.grant_title = npp.grant_title 
                      AND npp2.lead_center_id = npp.lead_center_id 
                      AND npp2.results_id = ?
           WHERE npp.results_id = ?
           AND nppb.is_active > 0`;
        await this.query(queryData, [
          config.user.id,
          config.user.id,
          config.new_result_id,
          config.old_result_id,
        ]);
        const queryFind = `
        SELECT 
        nppb.created_by
        ,nppb.created_date
        ,nppb.in_cash
        ,nppb.in_kind
        ,nppb.is_active
        ,nppb.is_determined
        ,nppb.last_updated_by
        ,nppb.last_updated_date
        ,nppb.non_pooled_projetct_budget_id
        ,nppb.non_pooled_projetct_id
         FROM non_pooled_projetct_budget nppb
         	INNER JOIN non_pooled_project npp ON npp.id = nppb.non_pooled_projetct_id 
         									AND	npp.is_active > 0
         WHERE npp.results_id = ?
         		AND nppb.is_active > 0
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
