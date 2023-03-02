import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleSelectorPageComponent } from './module-selector-page.component';

const routes: Routes = [{ path: '', component: ModuleSelectorPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSelectorPageRoutingModule {}
