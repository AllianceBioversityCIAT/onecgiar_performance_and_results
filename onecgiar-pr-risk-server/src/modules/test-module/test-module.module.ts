import { Module } from '@nestjs/common';
import { TestModuleService } from './test-module.service';
import { TestModuleController } from './test-module.controller';

@Module({
  controllers: [TestModuleController],
  providers: [TestModuleService]
})
export class TestModuleModule {}
