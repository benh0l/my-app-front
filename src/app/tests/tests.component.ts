import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Test } from '../shared/interfaces/test';
import {Router} from '@angular/router';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import {TestsService} from '../shared/services/tests.service';
import {Group} from '../shared/interfaces/group';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
  providers: []
})
export class TestsComponent implements OnInit {
  private _tests: Test[];
  private _dataSource: MatTableDataSource<Test>;

  constructor(private _router: Router) {
    this._tests = [];
    this._dataSource = new MatTableDataSource<Test>();
  }

  @Input()
  set tests(tests: Test[]){
    this._tests = tests;
    this._dataSource.data = this._tests;
  }

  get tests(){
    return this._tests;
  }

  get dataSource(): MatTableDataSource<Test>{
    return this._dataSource;
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToTest(testId: string){
    of(testId)
      .pipe(
        filter(_ => !!_)
      )
      .subscribe(_ => this._router.navigate(['/test', _]));
  }

  ngOnInit() {
  }

}
