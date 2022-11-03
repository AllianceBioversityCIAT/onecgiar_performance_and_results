import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { EvidencesRepository } from './evidences.repository';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { TokenDto } from '../../../shared/globalInterfaces/token.dto';
import { ResultRepository } from '../result.repository';
import { Evidence } from './entities/evidence.entity';
import { VersionRepository } from '../versions/version.repository';

@Injectable()
export class EvidencesService {
  constructor(
    private readonly _evidencesRepository: EvidencesRepository,
    private readonly _handlersError: HandlersError,
    private readonly _resultRepository: ResultRepository,
    private readonly _versionRepository: VersionRepository
  ){}
  async create(createEvidenceDto: CreateEvidenceDto, user: TokenDto) {
    try {
      const result = await this._resultRepository.getResultById(createEvidenceDto.result_id);
      const vr = await this._versionRepository.getBaseVersion();
      if(createEvidenceDto?.evidences){
        await this._evidencesRepository.updateEvidences(createEvidenceDto.result_id, createEvidenceDto.evidences.map(e => e.link.trim()), user.id, false)
        const long: number = createEvidenceDto.evidences.length > 3? 3: createEvidenceDto.evidences.length; 
        let newsEvidencesArray: Evidence[] = [];
        for (let index = 0; index < long; index++) {
          const evidence = createEvidenceDto.evidences[index];
          let eExists = await this._evidencesRepository.getEvidencesByResultIdAndLink(result.id, evidence.link, false);
          if(!eExists){
            let newEvidnece = new Evidence();

            /**
             * !aca se agrega la funcion par alinkear con un knowledge_product_related
             */

            newEvidnece.created_by = user.id;
            newEvidnece.last_updated_by = user.id;
            newEvidnece.description = evidence.description;
            newEvidnece.gender_related = evidence.gender_related;
            newEvidnece.youth_related = evidence.youth_related;
            newEvidnece.is_supplementary = false;
            newEvidnece.link = evidence.link;
            newEvidnece.result_id = result.id;
            newEvidnece.version_id = vr.id;
            newsEvidencesArray.push(newEvidnece);
          }else{
            eExists.description = evidence.description;
            eExists.gender_related = evidence.gender_related;
            eExists.youth_related = evidence.youth_related;
            newsEvidencesArray.push(eExists);
          }
        }
        await this._evidencesRepository.save(newsEvidencesArray);
      }

      if(createEvidenceDto?.supplementary){
        await this._evidencesRepository.updateEvidences(createEvidenceDto.result_id, createEvidenceDto.supplementary.map(e => e.link.trim()), user.id, true)
        const long: number = createEvidenceDto.supplementary.length > 3? 3: createEvidenceDto.supplementary.length; 
        let newsEvidencesArray: Evidence[] = [];
        for (let index = 0; index < long; index++) {
          const supplementary = createEvidenceDto.supplementary[index];
          const eExists = await this._evidencesRepository.getEvidencesByResultIdAndLink(result.id, supplementary.link, true);
          if(!eExists){
            let newEvidnece = new Evidence();
            newEvidnece.created_by = user.id;
            newEvidnece.last_updated_by = user.id;
            newEvidnece.description = supplementary.description;
            newEvidnece.is_supplementary = true;
            newEvidnece.link = supplementary.link;
            newEvidnece.result_id = result.id;
            newEvidnece.version_id = vr.id;
            newsEvidencesArray.push(newEvidnece);
          }else{
            eExists.description = supplementary.description;
            newsEvidencesArray.push(eExists);
          }
        }
        await this._evidencesRepository.save(newsEvidencesArray);
      }
      return {
        response: createEvidenceDto,
        message: 'The data was updated correctly',
        status: HttpStatus.OK,
      }
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  async findAll(resultId: number) {
    try {
      const evidences = await this._evidencesRepository.getEvidencesByResultId(resultId, false);
      const supplementary = await this._evidencesRepository.getEvidencesByResultId(resultId, true);
      return {
        response: {
          evidences,
          supplementary
        },
        message: 'Successful response',
        status: HttpStatus.OK,
      }
    } catch (error) {
      return this._handlersError.returnErrorRes({ error, debug: true });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} evidence`;
  }

  update(id: number, updateEvidenceDto: UpdateEvidenceDto) {
    return `This action updates a #${id} evidence ${updateEvidenceDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} evidence`;
  }
}
