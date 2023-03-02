import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskManagementRoutingModule } from './risk-management-routing.module';
import { RiskManagementComponent } from './risk-management.component';

@NgModule({
  declarations: [RiskManagementComponent],
  exports: [RiskManagementComponent],
  imports: [CommonModule, RiskManagementRoutingModule]
})
export class RiskManagementModule {}
