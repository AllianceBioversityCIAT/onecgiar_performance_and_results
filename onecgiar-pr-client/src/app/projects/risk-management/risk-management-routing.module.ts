import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskManagementComponent } from './risk-management.component';

const routes: Routes = [{ path: '', component: RiskManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementRoutingModule {}
