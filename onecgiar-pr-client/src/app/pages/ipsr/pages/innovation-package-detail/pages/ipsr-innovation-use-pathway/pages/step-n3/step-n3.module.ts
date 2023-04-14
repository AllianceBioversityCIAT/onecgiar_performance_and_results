import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepN3RoutingModule } from './step-n3-routing.module';
import { StepN3Component } from './step-n3.component';
import { CustomFieldsModule } from 'src/app/custom-fields/custom-fields.module';
import { StepN3CurrentUseComponent } from './components/step-n3-current-use/step-n3-current-use.component';
import { YmzListStructureItemModule } from 'src/app/shared/directives/ymz-list-structure-item/ymz-list-structure-item.module';
import { StepN3ComplementaryInnovationsComponent } from './components/step-n3-complementary-innovations/step-n3-complementary-innovations.component';

@NgModule({
  declarations: [StepN3Component, StepN3CurrentUseComponent, StepN3ComplementaryInnovationsComponent],
  imports: [CommonModule, StepN3RoutingModule, CustomFieldsModule, YmzListStructureItemModule]
})
export class StepN3Module {}
