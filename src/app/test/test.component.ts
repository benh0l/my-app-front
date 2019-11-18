import { Component, OnInit } from '@angular/core';
import { Test } from '../shared/interfaces/test'
import {TestsService} from '../shared/services/tests.service';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {flatMap, tap, filter} from 'rxjs/operators';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [TestsService, CustomValidatorsService, MatDialog]
})
export class TestComponent implements OnInit {
  public readonly VIEW_WATCH = 'watch';
  public readonly VIEW_EDIT = 'edit';
  private _test = {} as Test;
  private _dataSource: MatTableDataSource<Test>;
  private _view: string;
  private _isCreated: boolean;
  private _isEditing: boolean;
  private readonly _form: FormGroup;
  // private _grades: Grade[];

  constructor(private _router: Router, private _testsService: TestsService, private _route: ActivatedRoute, private _customValidatorsService: CustomValidatorsService) {
    this._test = {} as Test;
    this._isCreated = false;
    this._isEditing = false;
    this._form = this._buildForm();
  }

  get dataSource(): MatTableDataSource<Test>{
    return this._dataSource;
  }

  get lesson(): Test{
    return this._test;
  }

  get isCreated(): boolean{
    return this._isCreated;
  }

  set isCreated(_ : boolean){
    if(_)
      this.isEditing = true;
    this._isCreated = _;
  }

  get isEditing(): boolean{
    return this._isEditing;
  }
  get form(): FormGroup {
    return this._form;
  }

  set isEditing(_ : boolean){
    this._isEditing = _;
  }

  ngOnInit() {
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._testsService.fetchOne(params.id)),
      tap(_ => {this._isCreated = true;})
    ).subscribe((test: any) => {
        this._test = test;
        this._form.patchValue(test);
      },
      () => {console.log("Error: Couldn't find test'"+this._test.id+"'.");},
      () => {console.log("complete: "+this._test);}
    );
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  switchView(){
    this._view = (this._view === this.VIEW_WATCH) ? this.VIEW_EDIT : this.VIEW_WATCH;
  }

  private _buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl( '0'),
      title : new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])),
      coefficient: new FormControl('', Validators.compose([
        Validators.required, Validators.min(0), Validators.max(20)
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

}
