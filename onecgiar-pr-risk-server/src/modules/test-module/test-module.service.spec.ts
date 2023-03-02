import { Test, TestingModule } from '@nestjs/testing';
import { TestModuleService } from './test-module.service';

describe('TestModuleService', () => {
  let service: TestModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestModuleService],
    }).compile();

    service = module.get<TestModuleService>(TestModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
