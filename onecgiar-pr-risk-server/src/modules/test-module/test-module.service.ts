import { Injectable } from '@nestjs/common';
import { CreateTestModuleDto } from './dto/create-test-module.dto';
import { UpdateTestModuleDto } from './dto/update-test-module.dto';

@Injectable()
export class TestModuleService {
  create(createTestModuleDto: CreateTestModuleDto) {
    return 'This action adds a new testModule';
  }

  findAll() {
    return `This action returns all testModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testModule`;
  }

  update(id: number, updateTestModuleDto: UpdateTestModuleDto) {
    return `This action updates a #${id} testModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} testModule`;
  }
}
