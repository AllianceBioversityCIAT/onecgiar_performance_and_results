import { Injectable, HttpStatus } from '@nestjs/common';
import {
  HandlersError,
  ReturnResponse,
} from '../../shared/handlers/error.utils';
import { TocResultsRepository } from './toc-results.repository';
import { isProduction } from '../../shared/utils/validation.utils';

@Injectable()
export class TocResultsService {
  constructor(
    private readonly _handlersError: HandlersError,
    private readonly _tocResultsRepository: TocResultsRepository,
    private readonly _returnResponse: ReturnResponse,
  ) {}

  async findTocResultByConfig(
    result_id: number,
    init_id: number,
    toc_level: number,
  ) {
    try {
      let res = await this._tocResultsRepository.$_getResultTocByConfig(
        result_id,
        init_id,
        toc_level,
      );
      if (!res.length && toc_level == 4) {
        res = await this._tocResultsRepository.getAllOutcomeByInitiative(
          toc_level,
        );
      }
      return this._returnResponse.format({
        message: 'Successful response',
        response: res,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return this._returnResponse.format(error, !isProduction());
    }
  }

  async findAllByinitiativeId(initiativeId: number, levelId: number) {
    try {
      let tocResults =
        await this._tocResultsRepository.getAllTocResultsByInitiative(
          initiativeId,
          levelId,
        );

      if (!tocResults.length && levelId == 4) {
        tocResults = await this._tocResultsRepository.getAllOutcomeByInitiative(
          initiativeId,
        );
      }
      if (!tocResults.length) {
        throw {
          response: {},
          message: 'ToC Results Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        response: tocResults,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async findFullInitiativeTocByResult(resultId: number) {
    try {
      const tocResults =
        await this._tocResultsRepository.getFullInitiativeTocByResult(resultId);
      if (!tocResults.length) {
        throw {
          response: {},
          message: 'ToC Results Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        response: tocResults,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }

  async findFullInitiativeTocByInitiative(initiativeId: number) {
    try {
      const tocResults =
        await this._tocResultsRepository.getFullInitiativeTocByInitiative(
          initiativeId,
        );
      if (!tocResults.length) {
        throw {
          response: {},
          message: 'ToC by Initiative Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        response: tocResults,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }
}
