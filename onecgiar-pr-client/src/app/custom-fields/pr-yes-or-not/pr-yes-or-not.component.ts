import { Component, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RolesService } from '../../shared/services/global/roles.service';
import { GreenChecksService } from '../../shared/services/global/green-checks.service';
import { DataControlService } from '../../shared/services/data-control.service';

@Component({
  selector: 'app-pr-yes-or-not',
  templateUrl: './pr-yes-or-not.component.html',
  styleUrls: ['./pr-yes-or-not.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrYesOrNotComponent),
      multi: true
    }
  ]
})
export class PrYesOrNotComponent {
  @Input() label: string;
  @Input() description: string;
  @Input() readOnly: boolean;
  @Input() isStatic: boolean = false;
  @Input() required: boolean = true;
  @Input() hideOptions: boolean;
  @Input() editable: boolean = false;
  @Input() hideDescription: boolean = false;
  @Input() showDescriptionLabel: boolean = true;
  @Input() descInlineStyles: string = 'true';

  @Output() selectOptionEvent = new EventEmitter();
  private _value: boolean;

  constructor(public rolesSE: RolesService, public dataControlSE: DataControlService) {}

  get value() {
    return this._value;
  }

  set value(v: boolean) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  onChange(_) {}

  onTouch() {}

  writeValue(value: any): void {
    this._value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onclickYes() {
    this.value = true;
    this.selectOptionEvent.emit();
  }

  onClickNo() {
    this.value = false;
    this.selectOptionEvent.emit();
  }
}
