import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomValidatorsService {

  /**
   * Function to control email with custom validator
   */
  email(control: FormControl) {
    // returns control
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value) ? null : {
      email: true
    };
  }

  startBeforeEnd(startKey: string, endKey: string, errorKey: string = 'endBeforeStart'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control) { return null; }

      const start = control.get(startKey);
      const end = control.get(endKey);
      if (!start.value || !end.value) {
        return null;
      }

      const startDate = new Date(start.value);
      const endDate = new Date(end.value);

      if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
        return null;
      } else if (startDate > endDate) {
        const obj = {};
        obj[errorKey] = true;
        return obj;
      }
      return null;
    };
  }
  private isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(Number(date));
  }
}
