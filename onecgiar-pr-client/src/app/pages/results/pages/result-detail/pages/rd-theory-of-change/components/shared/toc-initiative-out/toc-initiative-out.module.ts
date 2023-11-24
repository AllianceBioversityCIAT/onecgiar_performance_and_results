import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TocInitiativeOutComponent } from './toc-initiative-out.component';
import { CustomFieldsModule } from '../../../../../../../../../custom-fields/custom-fields.module';
import { OutcomeLevelFilterPipe } from '../../../outcome-level-filter.pipe';
import { TargetIndicatorComponent } from './target-indicator/target-indicator.component';
import { ImpactAreaTargetsComponent } from './impact-area-targets/impact-area-targets.component';
import { SdgTargetsComponent } from './sdg-targets/sdg-targets.component';
import { FeedbackValidationDirectiveModule } from 'src/app/shared/directives/feedback-validation-directive.module';
import { ActionAreaOutcomeComponent } from './action-area-outcome/action-area-outcome.component';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { MultipleWPsComponent } from './multiple-wps/multiple-wps.component';
import { MultipleWPsContentComponent } from './multiple-wps/components/multiple-wps-content/multiple-wps-content.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [TocInitiativeOutComponent, OutcomeLevelFilterPipe, TargetIndicatorComponent, ImpactAreaTargetsComponent, SdgTargetsComponent, ActionAreaOutcomeComponent, MultipleWPsComponent, MultipleWPsContentComponent],
  exports: [TocInitiativeOutComponent, ImpactAreaTargetsComponent, SdgTargetsComponent, ActionAreaOutcomeComponent],
  imports: [CommonModule, CustomFieldsModule, FeedbackValidationDirectiveModule, TableModule, RouterModule, TooltipModule]
})
export class TocInitiativeOutModule {}
