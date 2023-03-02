import { Component, OnInit } from '@angular/core';
import { ModuleSelectorService } from './module-selector.service';

@Component({
  selector: 'app-module-selector',
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.scss']
})
export class ModuleSelectorComponent {
  constructor(public moduleSelectorSE: ModuleSelectorService) {}
}
