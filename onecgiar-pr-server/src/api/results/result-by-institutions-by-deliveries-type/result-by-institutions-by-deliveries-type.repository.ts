import { Injectable, Logger } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { ResultByInstitutionsByDeliveriesType } from './entities/result-by-institutions-by-deliveries-type.entity';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../shared/globalInterfaces/replicable.interface';
import {
  VERSIONING,
  predeterminedDateValidation,
} from '../../../shared/utils/versioning.utils';
import { LogicalDelete } from '../../../shared/globalInterfaces/delete.interface';

@Injectable()
export class ResultByInstitutionsByDeliveriesTypeRepository
  extends Repository<ResultByInstitutionsByDeliveriesType>
  implements
    ReplicableInterface<ResultByInstitutionsByDeliveriesType>,
    LogicalDelete<ResultByInstitutionsByDeliveriesType>
{
  private readonly _logger: Logger = new Logger(
    ResultByInstitutionsByDeliveriesTypeRepository.name,
  );
  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(
      ResultByInstitutionsByDeliveriesType,
      dataSource.createEntityManager(),
    );
  }

  fisicalDelete(resultId: number): Promise<any> {
    const queryData = `delete rbibdt from result_by_institutions_by_deliveries_type rbibdt 
    inner join results_by_institution rbi on rbi.id = rbibdt.result_by_institution_id
  where rbi.result_id = ?;`;
    return this.query(queryData, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          error: err,
          className: ResultByInstitutionsByDeliveriesType.name,
          debug: true,
        }),
      );
  }

  logicalDelete(
    resultId: number,
  ): Promise<ResultByInstitutionsByDeliveriesType> {
    const queryData = `update result_by_institutions_by_deliveries_type rbibdt 
                          inner join results_by_institution rbi on rbi.id = rbibdt.result_by_institution_id
                        set rbibdt.is_active = false
                        where rbi.result_id = ?`;
    return this.query(queryData, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          error: err,
          className: ResultByInstitutionsByDeliveriesType.name,
          debug: true,
        }),
      );
  }

  async replicable(
    config: ReplicableConfigInterface<ResultByInstitutionsByDeliveriesType>,
  ): Promise<ResultByInstitutionsByDeliveriesType[]> {
    let final_data: ResultByInstitutionsByDeliveriesType[] = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        select null as id,
        rbibdt.is_active,
        ${predeterminedDateValidation(
          config?.predetermined_date,
        )} as created_date,
        null as last_updated_date,
        rbibdt.partner_delivery_type_id,
        rbi2.id as result_by_institution_id,
        ? as versions_id,
        ? as created_by,
        ? as last_updated_by 
        from result_by_institutions_by_deliveries_type rbibdt 
              inner join results_by_institution rbi on rbi.id = rbibdt.result_by_institution_id
                                and rbi.result_id = ?
              inner join results_by_institution rbi2 on rbi2.institutions_id = rbi.institutions_id 
                                and rbi.institution_roles_id = rbi2.institution_roles_id
                                and rbi2.result_id = ?`;
        const response = await (<
          Promise<ResultByInstitutionsByDeliveriesType[]>
        >this.query(queryData, [
          config.phase,
          config.user.id,
          config.user.id,
          config.old_result_id,
          config.new_result_id,
        ]));
        const response_edit = <ResultByInstitutionsByDeliveriesType[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        insert into result_by_institutions_by_deliveries_type 
          (
          is_active,
          created_date,
          last_updated_date,
          partner_delivery_type_id,
          result_by_institution_id,
          versions_id,
          created_by,
          last_updated_by 
          )
          select
          rbibdt.is_active,
          ${predeterminedDateValidation(
            config?.predetermined_date,
          )} as created_date,
          now() as last_updated_date,
          rbibdt.partner_delivery_type_id,
          rbi2.id as result_by_institution_id,
          ? as versions_id,
          ? as created_by,
          ? as last_updated_by 
          from result_by_institutions_by_deliveries_type rbibdt 
          			inner join results_by_institution rbi on rbi.id = rbibdt.result_by_institution_id
          												and rbi.result_id = ?
          			inner join results_by_institution rbi2 on rbi2.institutions_id = rbi.institutions_id 
                                  and rbi.institution_roles_id = rbi2.institution_roles_id
          												and rbi2.result_id = ? 
          where rbibdt.is_active > 0;
        `;
        await this.query(queryData, [
          config.phase,
          config.user.id,
          config.user.id,
          config.old_result_id,
          config.new_result_id,
        ]);
        const queryFind = `
        select
          rbibdt.id,
          rbibdt.is_active,
          rbibdt.created_date,
          rbibdt.last_updated_date,
          rbibdt.partner_delivery_type_id,
          rbibdt.result_by_institution_id,
          rbibdt.versions_id,
          rbibdt.created_by,
          rbibdt.last_updated_by 
          from result_by_institutions_by_deliveries_type rbibdt
          			inner join results_by_institution rbi on rbi.id = rbibdt.result_by_institution_id 
          where rbibdt.is_active > 0 and rbi.result_id = ?;
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

  async getDeliveryByTypeAndResultByInstitution(
    resultByInstitution: number,
    deliveryType: number,
  ) {
    const query = `
    select 
    rbibdt.id,
    rbibdt.is_active,
    rbibdt.created_date,
    rbibdt.last_updated_date,
    rbibdt.partner_delivery_type_id,
    rbibdt.result_by_institution_id,
    rbibdt.versions_id,
    rbibdt.created_by,
    rbibdt.last_updated_by
    from result_by_institutions_by_deliveries_type rbibdt 
    where rbibdt.is_active > 0
    	and rbibdt.result_by_institution_id = ?
    	and rbibdt.partner_delivery_type_id = ?;
    `;

    try {
      const result: ResultByInstitutionsByDeliveriesType[] = await this.query(
        query,
        [resultByInstitution, deliveryType],
      );
      return result.length ? result[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultByInstitutionsByDeliveriesType.name,
        error: error,
        debug: true,
      });
    }
  }

  async getDeliveryByResultByInstitution(resultByInstitutionsId: number[]) {
    const query = `
    select 
    rbibdt.id,
    rbibdt.is_active,
    rbibdt.created_date,
    rbibdt.last_updated_date,
    rbibdt.partner_delivery_type_id,
    rbibdt.result_by_institution_id,
    rbibdt.versions_id,
    rbibdt.created_by,
    rbibdt.last_updated_by
    from result_by_institutions_by_deliveries_type rbibdt 
    where rbibdt.is_active > 0
    	and rbibdt.result_by_institution_id in (${
        resultByInstitutionsId?.toString() || null
      });
    `;

    try {
      const result: ResultByInstitutionsByDeliveriesType[] = await this.query(
        query,
      );
      return result;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultByInstitutionsByDeliveriesType.name,
        error: error,
        debug: true,
      });
    }
  }

  async inactiveResultDeLivery(
    resultByInstitution: number,
    deliveryType: number[],
    userId: number,
  ) {
    deliveryType = deliveryType ? deliveryType : [];
    const updateInactive = `
    update result_by_institutions_by_deliveries_type 
    set is_active = 0,
    	last_updated_date  = NOW(),
    	last_updated_by = ?
    	where is_active > 0
    		and result_by_institution_id = ?
    		and partner_delivery_type_id not in (${deliveryType.toString()});
    `;

    const updateActive = `
    update result_by_institutions_by_deliveries_type 
    set is_active = 1,
    	last_updated_date  = NOW(),
    	last_updated_by = ?
    	where result_by_institution_id = ?
    		and partner_delivery_type_id in (${deliveryType.toString()});
    `;

    const inactiveAll = `
    update result_by_institutions_by_deliveries_type 
    set is_active = 0,
    	last_updated_date  = NOW(),
    	last_updated_by = ?
    	where result_by_institution_id = ?;
    `;
    try {
      if (deliveryType.length) {
        const resultInactive = await this.query(updateInactive, [
          userId,
          resultByInstitution,
        ]);

        return await this.query(updateActive, [userId, resultByInstitution]);
      } else {
        return await this.query(inactiveAll, [userId, resultByInstitution]);
      }
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultByInstitutionsByDeliveriesType.name,
        error: error,
        debug: true,
      });
    }
  }
}
