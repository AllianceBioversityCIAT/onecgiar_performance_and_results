import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityAssuranceRoutingModule } from './quality-assurance-routing.module';
import { QualityAssuranceComponent } from './quality-assurance.component';
import { CustomFieldsModule } from '../../custom-fields/custom-fields.module';

@NgModule({
  declarations: [QualityAssuranceComponent],
  exports: [QualityAssuranceComponent],
  imports: [CommonModule, QualityAssuranceRoutingModule, CustomFieldsModule]
})
export class QualityAssuranceModule {}
