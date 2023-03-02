import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { extraRoutingApp, routingApp } from '../../shared/routing/routing-data';
import { ReportingToolComponent } from './reporting-tool.component';

const routes: Routes = [{ path: '', component: ReportingToolComponent, children: [...extraRoutingApp, ...routingApp] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingToolRoutingModule {}
