import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingToolRoutingModule } from './reporting-tool-routing.module';
import { ReportingToolComponent } from './reporting-tool.component';
import { NavigationBarComponent } from '../../shared/components/navigation-bar/navigation-bar.component';

@NgModule({
  declarations: [ReportingToolComponent, NavigationBarComponent],
  imports: [CommonModule, ReportingToolRoutingModule]
})
export class ReportingToolModule {}
