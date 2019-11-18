import { Component, OnInit } from '@angular/core';
import { Test } from '../shared/interfaces/test'


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
// @ts-ignore
export class TestComponent implements OnInit {
  private _test = {} as Test;

  constructor() {
    this._test = {} as Test;
  }

  ngOnInit() {
  }

}
