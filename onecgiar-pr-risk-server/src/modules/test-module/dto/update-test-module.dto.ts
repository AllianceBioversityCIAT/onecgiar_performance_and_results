import { PartialType } from '@nestjs/mapped-types';
import { CreateTestModuleDto } from './create-test-module.dto';

export class UpdateTestModuleDto extends PartialType(CreateTestModuleDto) {}
