import { Controller } from '@nestjs/common';
import { ClarisaInstitutionsService } from './clarisa-institutions.service';

@Controller()
export class ClarisaInstitutionsController {
  constructor(
    private readonly clarisaInstitutionsService: ClarisaInstitutionsService,
  ) {}
}
