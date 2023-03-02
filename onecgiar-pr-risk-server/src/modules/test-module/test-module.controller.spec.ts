import { Test, TestingModule } from '@nestjs/testing';
import { TestModuleController } from './test-module.controller';
import { TestModuleService } from './test-module.service';

describe('TestModuleController', () => {
  let controller: TestModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestModuleController],
      providers: [TestModuleService],
    }).compile();

    controller = module.get<TestModuleController>(TestModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
