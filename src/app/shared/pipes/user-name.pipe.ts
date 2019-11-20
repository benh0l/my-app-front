import { Pipe, PipeTransform } from '@angular/core';
import {CapitalizePipe} from './capitalize.pipe';
import {User} from '../interfaces/user';
import {isString} from 'util';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  constructor(private _capitalize: CapitalizePipe){}

  transform(value: any, useFirstLetter = false): any {
    var user = value as User;
    if(!user || isString(value))
      return value;
    if(useFirstLetter)
      return `${user.firstname}  ${user.lastname[0].toUpperCase()}.`;
    else
      return `${this._capitalize.transform(user.firstname)}  ${user.lastname.toUpperCase()}`;
  }

}
