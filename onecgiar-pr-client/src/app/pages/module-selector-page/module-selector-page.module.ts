import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleSelectorPageRoutingModule } from './module-selector-page-routing.module';
import { ModuleSelectorPageComponent } from './module-selector-page.component';


@NgModule({
  declarations: [
    ModuleSelectorPageComponent
  ],
  imports: [
    CommonModule,
    ModuleSelectorPageRoutingModule
  ]
})
export class ModuleSelectorPageModule { }
