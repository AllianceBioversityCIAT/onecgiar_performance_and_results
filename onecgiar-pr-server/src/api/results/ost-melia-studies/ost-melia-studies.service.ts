import { HttpStatus, Injectable } from '@nestjs/common';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { CreateOstMeliaStudyDto } from './dto/create-ost-melia-study.dto';
import { UpdateOstMeliaStudyDto } from './dto/update-ost-melia-study.dto';
import { OstMeliaStudiesRepository } from './ost-melia-studies.repository';

@Injectable()
export class OstMeliaStudiesService {
  constructor(
    private readonly _handlersError: HandlersError,
    private readonly _ostMeliaStudiesRepository: OstMeliaStudiesRepository,
  ) {}

  async getMeliaStudiesFromResultId(initiativeId: number) {
    try {
      const meliaStudies =
        await this._ostMeliaStudiesRepository.getMeliaStudiesFromResultId(
          initiativeId,
        );
      if (!meliaStudies.length) {
        throw {
          response: {},
          message: 'Melia Studies Not Found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        response: meliaStudies,
        message: 'Successful response',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorRes({ error });
    }
  }
}
