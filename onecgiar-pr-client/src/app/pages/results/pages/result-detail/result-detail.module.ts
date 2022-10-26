import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultDetailRoutingModule } from './result-detail-routing.module';
import { ResultDetailComponent } from './result-detail.component';
import { PanelMenuComponent } from './panel-menu/panel-menu.component';
import { UtilsComponentsModule } from '../../../../shared/components/utils-components/utils-components.module';
import { PanelMenuPipe } from './panel-menu/pipes/panel-menu.pipe';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [ResultDetailComponent, PanelMenuComponent, PanelMenuPipe],
  imports: [CommonModule, ResultDetailRoutingModule, UtilsComponentsModule, DialogModule]
})
export class ResultDetailModule {}
