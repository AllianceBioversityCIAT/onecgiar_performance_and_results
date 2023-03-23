import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpsrContributorsRoutingModule } from './ipsr-contributors-routing.module';
import { CustomFieldsModule } from '../../../../../../custom-fields/custom-fields.module';
import { IpsrContributorsComponent } from './ipsr-contributors.component';
import { TocInitiativeOutModule } from '../../../../../results/pages/result-detail/pages/rd-theory-of-change/components/shared/toc-initiative-out/toc-initiative-out.module';

@NgModule({
  declarations: [IpsrContributorsComponent],
  imports: [CommonModule, IpsrContributorsRoutingModule, CustomFieldsModule, TocInitiativeOutModule]
})
export class IpsrContributorsModule {}
