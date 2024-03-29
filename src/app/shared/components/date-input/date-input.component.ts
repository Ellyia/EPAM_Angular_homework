import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateInputComponent),
  multi: true
};

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DateInputComponent implements ControlValueAccessor {
  value: string = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  onInputChange(e: any): void {
    this.value = e.target.value;
    this.onChange(this.value);

    this.cdr.detectChanges();
  }

  writeValue(value: any) {
    this.value = value || '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  markAsTouched(): void {
    this.onTouched();
  }
}
