import { Module } from '@nestjs/common';
import { ClarisaGlobalTargetService } from './clarisa-global-target.service';
import { ClarisaGlobalTargetController } from './clarisa-global-target.controller';
import { RouterModule } from '@nestjs/core';
import { ClarisaGlobalTargetRoutes } from './clarisaGlobalTarget.routes';
import { ClarisaGobalTargetRepository } from './ClariasaGlobalTarget.repository';

@Module({
  controllers: [ClarisaGlobalTargetController],
  providers: [ClarisaGlobalTargetService, ClarisaGobalTargetRepository],
  imports: [],
  exports: [ClarisaGobalTargetRepository],
})
export class ClarisaGlobalTargetModule {}
