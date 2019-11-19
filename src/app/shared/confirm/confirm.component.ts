import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  private readonly _confirm$: EventEmitter<void>;
  private readonly _cancel$: EventEmitter<void>;
  private _title: string;
  private _sentence: string;

  constructor() {
    this._confirm$ = new EventEmitter<void>();
    this._cancel$ = new EventEmitter<void>();
  }

  @Input()
  set title(title: string){
    this._title = title;
  }

  get title(): string {
    return this._title;
  }

  @Input()
  set sentence(sentence: string){
   this._sentence = sentence;
  }

  get sentence(): string {
    return this._sentence;
  }

  @Output('cancel')
  get cancel$(): EventEmitter<void> {
    return this._cancel$;
  }

  @Output('confirm')
  get confirm$(): EventEmitter<void> {
    return this._confirm$;
  }

  ngOnInit() {
  }

  confirm(){
    this._confirm$.emit();
  }

  cancel(){
    this._cancel$.emit();
  }
}
