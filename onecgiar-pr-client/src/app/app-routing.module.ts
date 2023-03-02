import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'risk-management', loadChildren: () => import('./projects/risk-management/risk-management.module').then(m => m.RiskManagementModule) },
  { path: 'module-selector-page', loadChildren: () => import('./pages/module-selector-page/module-selector-page.module').then(m => m.ModuleSelectorPageModule) },
  { path: '', loadChildren: () => import('./projects/reporting-tool/reporting-tool.module').then(m => m.ReportingToolModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
