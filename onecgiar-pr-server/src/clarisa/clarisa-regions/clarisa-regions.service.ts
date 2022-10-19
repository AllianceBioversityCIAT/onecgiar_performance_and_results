import { Injectable } from '@nestjs/common';
import { CreateClarisaRegionDto } from './dto/create-clarisa-region.dto';
import { UpdateClarisaRegionDto } from './dto/update-clarisa-region.dto';

@Injectable()
export class ClarisaRegionsService {
  create(createClarisaRegionDto: CreateClarisaRegionDto) {
    return createClarisaRegionDto;
  }

  findAll() {
    return `This action returns all clarisaRegions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clarisaRegion`;
  }

  update(id: number, updateClarisaRegionDto: UpdateClarisaRegionDto) {
    return `This action updates a #${id} clarisaRegion ${updateClarisaRegionDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} clarisaRegion`;
  }
}
