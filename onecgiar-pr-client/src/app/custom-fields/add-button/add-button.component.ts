import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @Input() name: string = 'Unnamed';
  @Output() clickEvent = new EventEmitter();
  constructor() {}
}
