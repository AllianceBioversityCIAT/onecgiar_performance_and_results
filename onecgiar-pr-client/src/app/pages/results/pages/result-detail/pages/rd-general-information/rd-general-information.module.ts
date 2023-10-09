import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RdGeneralInformationRoutingModule } from './rd-general-information-routing.module';
import { RdGeneralInformationComponent } from './rd-general-information.component';
import { CustomFieldsModule } from '../../../../../../custom-fields/custom-fields.module';
import { InstitutionsPipesModule } from './pipes/institutions-pipes.module';
import { RdAnnualUpdatingComponent } from './components/rd-annual-updating/rd-annual-updating.component';
import { FeedbackValidationDirectiveModule } from 'src/app/shared/directives/feedback-validation-directive.module';
import { ChangeResultTypeModalComponent } from './components/change-result-type-modal/change-result-type-modal.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PdfIconModule } from '../../../../../../shared/icon-components/pdf-icon/pdf-icon.module';
import { ConfirmationModalKPComponent } from './components/confirmation-modal-kp/confirmation-modal-kp.component';
import { ConfirmationKPComponent } from './components/confirmation-kp/confirmation-kp.component';

@NgModule({
  declarations: [RdGeneralInformationComponent, RdAnnualUpdatingComponent, ChangeResultTypeModalComponent, ConfirmationModalKPComponent, ConfirmationKPComponent],
  imports: [CommonModule, RdGeneralInformationRoutingModule, CustomFieldsModule, InstitutionsPipesModule, FeedbackValidationDirectiveModule, DialogModule, TableModule, PdfIconModule]
})
export class RdGeneralInformationModule {}
