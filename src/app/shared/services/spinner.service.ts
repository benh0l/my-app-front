import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _spinnerToggledSource = new Subject<boolean>();
  private _spinnerToggled$ = this._spinnerToggledSource.asObservable();
  private _askCount = 0;

  constructor() { }
  get spinnerToggled$(): Observable<boolean>{
    return this._spinnerToggled$;
  }
  reset(){
    this._askCount = 0;
  }
  start(){
    this._askCount ++;
    this._spinnerToggledSource.next(true);
  }
  stop(){
    this._askCount --;
    if(this._askCount < 0) this._askCount = 0;
    if(this._askCount == 0) {
      this._spinnerToggledSource.next(false);
    }else{
      this._spinnerToggledSource.next(true);
    }
  }
}
