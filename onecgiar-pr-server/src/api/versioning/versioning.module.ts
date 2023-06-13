import { Module } from '@nestjs/common';
import { VersioningService } from './versioning.service';
import { VersioningController } from './versioning.controller';

@Module({
  controllers: [VersioningController],
  providers: [VersioningService]
})
export class VersioningModule {}
