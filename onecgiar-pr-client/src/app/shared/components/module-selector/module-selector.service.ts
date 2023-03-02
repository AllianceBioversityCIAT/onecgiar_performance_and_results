import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuleSelectorService {
  selectorIsVisible = true;
  constructor() {}

  showSelector() {
    console.log('showSelector');
    // this.selectorIsVisible = true;
    document.getElementById('module_selector').style.left = '0vw';
  }

  hideSelector() {
    console.log('hideSelector');
    // this.selectorIsVisible = false;
    document.getElementById('module_selector').style.left = '100vw';
  }

  toggleSelector() {
    console.log('toggleSelect');
    this.selectorIsVisible = !this.selectorIsVisible;
  }
}
