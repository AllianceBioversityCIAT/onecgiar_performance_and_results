import { Component, OnInit } from '@angular/core';
import { ModuleSelectorService } from '../../shared/components/module-selector/module-selector.service';

@Component({
  selector: 'app-module-selector-page',
  templateUrl: './module-selector-page.component.html',
  styleUrls: ['./module-selector-page.component.scss']
})
export class ModuleSelectorPageComponent implements OnInit {
  constructor(private moduleSelectorSE: ModuleSelectorService) {}

  ngOnInit(): void {
    this.moduleSelectorSE.showSelector();
  }
}
