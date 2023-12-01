import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EvidenceSharepoint } from '../entities/evidence-sharepoint.entity';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import { LogicalDelete } from '../../../../shared/globalInterfaces/delete.interface';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';

@Injectable()
export class EvidenceSharepointRepository
  extends Repository<EvidenceSharepoint>
  implements
    ReplicableInterface<EvidenceSharepoint>,
    LogicalDelete<EvidenceSharepoint>
{
  private readonly _logger: Logger = new Logger(
    EvidenceSharepointRepository.name,
  );

  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(EvidenceSharepoint, dataSource.createEntityManager());
  }

  async replicable(
    config: ReplicableConfigInterface<EvidenceSharepoint>,
  ): Promise<EvidenceSharepoint | EvidenceSharepoint[]> {
    let final_data: EvidenceSharepoint[] = null;
    try {
      if (config.f?.custonFunction) {
        const dataQuery = `
        select 
        es.document_id,	
        es.file_name,
        es.folder_path,	
        es.is_public_file,	
        e2.id as evidence_id,	
        es.is_active,	
        now() as created_date,	
        now() as last_updated_date,	
        ? as created_by,	
        ? as last_updated_by
        from evidence_sharepoint es 
        inner join evidence e on e.id = es.evidence_id 
        						and es.is_active > 0
        inner join evidence e2 on e.link = e2.link 
        						and e2.result_id = ?
        where e.result_id = ? and e.is_active > 0;`;
        const response = await (<Promise<EvidenceSharepoint[]>>(
          this.query(dataQuery, [
            config.user.id,
            config.user.id,
            config.new_result_id,
            config.old_result_id,
          ])
        ));
        const response_edit = <EvidenceSharepoint[]>(
          config.f.custonFunction(response)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData = `
        insert into evidence_sharepoint (
          document_id,	
          file_name,
          folder_path,	
          is_public_file,	
          evidence_id,	
          is_active,	
          created_date,	
          last_updated_date,	
          created_by,	
          last_updated_by
          )
          select 
          es.document_id,	
          es.file_name,
          es.folder_path,	
          es.is_public_file,	
          e2.id as evidence_id,	
          es.is_active,	
          now() as created_date,	
          now() as last_updated_date,	
          ? as created_by,	
          ? as last_updated_by
          from evidence_sharepoint es 
          inner join evidence e on e.id = es.evidence_id 
                      and es.is_active > 0
          inner join evidence e2 on e.link = e2.link 
                      and e2.result_id = ?
          where e.result_id = ? and e.is_active > 0;`;
        await this.query(queryData, [
          config.user.id,
          config.user.id,
          config.new_result_id,
          config.old_result_id,
        ]);

        const queryFind = `
        select 
        es.id,
        es.document_id,	
        es.file_name,
        es.folder_path,	
        es.is_public_file,	
        es.evidence_id,	
        es.is_active,	
        es.created_date,	
        es.last_updated_date,	
        es.created_by,	
        es.last_updated_by
        from evidence_sharepoint es 
        inner join evidence e on e.id = es.evidence_id 
                    and es.is_active > 0
        where e.result_id = ?`;
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

  logicalDelete(resultId: number): Promise<EvidenceSharepoint> {
    const dataQuery = `update evidence_sharepoint es 
    inner join evidence e on e.id = es.evidence_id 
    set es.is_active = 0
  where e.result_id = ?;`;
    return this.query(dataQuery, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          className: EvidenceSharepointRepository.name,
          error: err,
          debug: true,
        }),
      );
  }
  async fisicalDelete(resultId: number): Promise<any> {
    const dataQuery = `delete es from evidence_sharepoint es 
    inner join evidence e on e.id = es.evidence_id
  where e.result_id = ?;`;
    return this.query(dataQuery, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          className: EvidenceSharepointRepository.name,
          error: err,
          debug: true,
        }),
      );
  }
}
