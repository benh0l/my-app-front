import { Pipe, PipeTransform } from '@angular/core';
import {isString} from 'util';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!isString(value)) {
      return value;
    }

    return value.toLowerCase()
      .split(' ')
      .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
      .join(' ');
  }
}
