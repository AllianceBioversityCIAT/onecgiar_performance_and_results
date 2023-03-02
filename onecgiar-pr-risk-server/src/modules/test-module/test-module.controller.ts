import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestModuleService } from './test-module.service';
import { CreateTestModuleDto } from './dto/create-test-module.dto';
import { UpdateTestModuleDto } from './dto/update-test-module.dto';

@Controller('test-module')
export class TestModuleController {
  constructor(private readonly testModuleService: TestModuleService) {}

  @Post()
  create(@Body() createTestModuleDto: CreateTestModuleDto) {
    return this.testModuleService.create(createTestModuleDto);
  }

  @Get()
  findAll() {
    return this.testModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestModuleDto: UpdateTestModuleDto) {
    return this.testModuleService.update(+id, updateTestModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testModuleService.remove(+id);
  }
}
