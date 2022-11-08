import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyChangeInfoRoutingModule } from './policy-change-info-routing.module';
import { PolicyChangeInfoComponent } from './policy-change-info.component';
import { CustomFieldsModule } from '../../../../../../../custom-fields/custom-fields.module';

@NgModule({
  declarations: [PolicyChangeInfoComponent],
  imports: [CommonModule, PolicyChangeInfoRoutingModule, CustomFieldsModule]
})
export class PolicyChangeInfoModule {}
