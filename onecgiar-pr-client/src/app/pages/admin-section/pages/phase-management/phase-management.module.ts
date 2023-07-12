import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhaseManagementRoutingModule } from './phase-management-routing.module';
import { PhaseManagementComponent } from './phase-management.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CustomFieldsModule } from '../../../../custom-fields/custom-fields.module';
import { ResultHistoryOfChangesModalModule } from '../completeness-status/components/result-history-of-changes-modal/result-history-of-changes-modal.module';
import { FilterByTextModule } from '../../../../shared/pipes/filter-by-text.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [PhaseManagementComponent],
  exports: [PhaseManagementComponent],
  imports: [CommonModule, ButtonModule, DropdownModule, TagModule, InputTextModule, PhaseManagementRoutingModule, TableModule, FormsModule, CustomFieldsModule, ResultHistoryOfChangesModalModule, FilterByTextModule]
})
export class PhaseManagementModule {}
