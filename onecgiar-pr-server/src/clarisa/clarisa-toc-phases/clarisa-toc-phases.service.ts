import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateClarisaTocPhaseDto } from './dto/create-clarisa-toc-phase.dto';
import { UpdateClarisaTocPhaseDto } from './dto/update-clarisa-toc-phase.dto';
import { ClarisaTocPhaseRepository } from './clarisa-toc-phases.repository';
import { ReturnResponse } from '../../shared/handlers/error.utils';
import { env } from 'process';

@Injectable()
export class ClarisaTocPhasesService {
  constructor(
    private readonly _clarisaTocPhaseRepository: ClarisaTocPhaseRepository,
    private readonly _returnResponse: ReturnResponse,
  ) {}

  async findAll() {
    try {
      const res = await this._clarisaTocPhaseRepository.find();
      return this._returnResponse.format({
        response: res,
        message: 'ToC phases found successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return this._returnResponse.format(error, !env.IS_PRODUCTION);
    }
  }
}
