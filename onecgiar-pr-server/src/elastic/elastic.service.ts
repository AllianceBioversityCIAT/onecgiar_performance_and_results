import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ResultSimpleDto } from '../api/results/dto/result-simple.dto';
import { HandlersError } from '../shared/handlers/error.utils';
import { ElasticOperationDto } from './dto/elastic-operation.dto';
import { env } from 'process';
import { lastValueFrom } from 'rxjs';
import { ResultRepository } from '../api/results/result.repository';

@Injectable()
export class ElasticService {
  private readonly _logger: Logger = new Logger(ElasticService.name);
  private readonly _bulkElasticUrl = `${env.ELASTIC_URL}_bulk`;
  private readonly _headers = {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${env.ELASTIC_USERNAME}:${env.ELASTIC_PASSWORD}`,
      ).toString('base64')}`,
      'Content-Type': 'application/x-ndjson',
    },
  };

  constructor(
    private readonly _http: HttpService,
    private readonly _handlersError: HandlersError,
    private readonly _resultRepository: ResultRepository,
  ) {}

  public getSingleElasticOperation<T>(
    documentName: string,
    operation: ElasticOperationDto<T>,
    fromBulk = false,
  ): string {
    const isPatch: boolean = operation.operation === 'PATCH';
    let elasticOperation = `{ "${
      isPatch ? 'create' : 'delete'
    }" : { "_index" : "${documentName}", "_id" : "${operation.data['id']}"  } }
    ${isPatch ? JSON.stringify(operation.data) : ''}`;
    if (!fromBulk) {
      elasticOperation = elasticOperation.concat('\n');
    }

    return elasticOperation;
  }

  public getSingleElasticOperationResult(
    documentName: string,
    operation: ElasticOperationDto<ResultSimpleDto>,
    fromBulk = false,
  ): string {
    const isPatch: boolean = operation.operation === 'PATCH';
    operation.data['is_legacy'] =
      <unknown>operation.data['is_legacy'] === 'true';

    let elasticOperation = `{ "${
      isPatch ? 'index' : 'delete'
    }" : { "_index" : "${documentName}", "_id" : "${
      operation.data['id']
    }"  } }\n${isPatch ? JSON.stringify(operation.data) : ''}`;
    if (fromBulk) {
      elasticOperation = elasticOperation.concat('\n');
    }

    return elasticOperation;
  }

  public getBulkElasticOperationResults(
    documentName: string,
    operation: ElasticOperationDto<ResultSimpleDto>[],
  ): string {
    let bulkElasticOperations = '';

    operation.forEach(
      (o) =>
        (bulkElasticOperations += this.getSingleElasticOperationResult(
          documentName,
          o,
          true,
        )),
    );
    bulkElasticOperations = bulkElasticOperations.concat('\n');

    return bulkElasticOperations;
  }

  public getBulkElasticOperations<T>(
    documentName: string,
    operation: ElasticOperationDto<T>[],
  ): string {
    let bulkElasticOperations = '';

    operation.forEach(
      (o) =>
        (bulkElasticOperations += this.getSingleElasticOperation(
          documentName,
          o,
          true,
        )),
    );
    bulkElasticOperations = bulkElasticOperations.concat('\n');

    return bulkElasticOperations;
  }

  public async sendBulkOperationToElastic(elasticJson: string) {
    try {
      const { data } = await lastValueFrom(
        this._http.post(this._bulkElasticUrl, elasticJson, this._headers),
      );

      return {
        response: data,
        message: 'Successfully updated the elastic',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({
        error: error.response?.data,
        debug: true,
      });
    }
  }

  async findForElasticSearch(documentName: string, id?: string) {
    try {
      const queryResult = await this._resultRepository.resultsForElasticSearch(
        id,
      );

      if (!queryResult.length) {
        throw {
          response: {},
          message: 'Results Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const operations: ElasticOperationDto<ResultSimpleDto>[] =
        queryResult.map((r) => new ElasticOperationDto('PATCH', r));

      const elasticJson: string = this.getBulkElasticOperationResults(
        documentName,
        operations,
      );

      return {
        response: elasticJson,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async resetElasticData() {
    try {
      const elasticJsonResponse = await this.findForElasticSearch(
        env.ELASTIC_DOCUMENT_NAME,
      );

      if (elasticJsonResponse.status >= 300) {
        throw this._handlersError.returnErrorRes({
          error: elasticJsonResponse,
        });
      }

      const elasticJsonString: string = elasticJsonResponse.response as string;

      const elasticDelete = await lastValueFrom(
        this._http.delete(
          `${env.ELASTIC_URL}${env.ELASTIC_DOCUMENT_NAME}`,
          this._headers,
        ),
      );
      if (elasticDelete.status >= 300) {
        throw this._handlersError.returnErrorRes({ error: elasticDelete });
      }

      const elasticCreate = await lastValueFrom(
        this._http.put(
          `${env.ELASTIC_URL}${env.ELASTIC_DOCUMENT_NAME}`,
          null,
          this._headers,
        ),
      );
      if (elasticCreate.status >= 300) {
        throw this._handlersError.returnErrorRes({ error: elasticCreate });
      }

      const bulkUploadResponse = await this.sendBulkOperationToElastic(
        elasticJsonString,
      );
      if (bulkUploadResponse.status >= 300) {
        throw this._handlersError.returnErrorRes({ error: bulkUploadResponse });
      }

      return {
        response: bulkUploadResponse.response,
        message: 'Successfully updated the elastic',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({
        error: error.response?.data,
        debug: true,
      });
    }
  }
}
