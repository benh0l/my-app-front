import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  providers: []
})
export class DialogComponent implements OnInit {
  private _confirmObject : any;
  private _title: string;
  private _sentence: string;

  constructor(private _dialogRef: MatDialogRef<DialogComponent>) { }

  set confirmObject(confirmObject: any){
    this._confirmObject = confirmObject;
  }

  set title(title: string){
    this._title = title;
  }

  get title(): string{
    return this._title;
  }

  set sentence(sentence: string){
    this._sentence = sentence;
  }

  get sentence(): string{
    return this._sentence;
  }

  ngOnInit() {
  }

  onCancel() {
    this._dialogRef.close();
  }

  onConfirm() {
    this._dialogRef.close(this._confirmObject);
  }
}
