import { Component, OnInit } from '@angular/core';
import { Test } from '../shared/interfaces/test'
import {TestsService} from '../shared/services/tests.service';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {flatMap, tap, filter} from 'rxjs/operators';
import {Location} from '@angular/common';
import {SnackBarService} from '../shared/services/snackbar.service';
import {Grade} from '../shared/interfaces/grade';
import {SpinnerService} from '../shared/services/spinner.service';
import {User} from '../shared/interfaces/user';
import {UsersService} from '../shared/services/users.service';
import {merge, of} from 'rxjs';
import {GradesService} from '../shared/services/grades.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [TestsService, GradesService, UsersService, CustomValidatorsService, MatDialog]
})
export class TestComponent implements OnInit {
  public readonly VIEW_WATCH = 'watch';
  public readonly VIEW_EDIT = 'edit';
  private _test = {} as Test;
  private _grades: Grade[];
  private _users: User[];
  private _isCreated: boolean;
  private _isEditing: boolean;
  private readonly _form: FormGroup;
  // private _grades: Grade[];

  constructor(private _router: Router, private _snackBarService: SnackBarService, private _testsService: TestsService, private _route: ActivatedRoute, private _usersService: UsersService, private _customValidatorsService: CustomValidatorsService, private _location: Location, private _spinnerService: SpinnerService, private _gradesService: GradesService) {
    this._test = {} as Test;
    this.isCreated = false;
    this._isEditing = false;
    this._form = this._buildForm();
  }

  get test(): Test{
    return this._test;
  }
  get grades(): Grade[]{
    return this._grades;
  }

  get isCreated(): boolean{
    return this._isCreated;
  }

  set isCreated(_ : boolean){
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

  private _fetchGrades(){
    merge(
      of(this._users).pipe(
        filter(_ => !!_),
        flatMap( _ => of(this._users)),
        tap(_ => {this._spinnerService.start(); })
      ),
      of(this._users).pipe(
        filter(_ => !_),
        flatMap( _ => this._usersService.fetch()),
        tap(_ => {this._spinnerService.start(); })
      )
    ).subscribe(
      (users: User[]) => {
        if(this._test.gradesId.length > 0) {
          this._users = users;
          this._gradesService
            .fetchMultiple(this._test.gradesId).subscribe(
            (grades: Grade[]) => {
              this._grades = grades;
              this._spinnerService.stop();
            },
            () => {
              this._spinnerService.stop();
              this._snackBarService.open(`Error: Couldn't load grades from test '${this._test.id}`);
            },
          );
        }else{
          this._spinnerService.stop();
        }
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: couldn't fetch students`);
      }
    );
  }

  private _fetchTest(){
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => {
        this._spinnerService.start();
        return this._testsService.fetchOne(params.id);
      })
    ).subscribe((test: any) => {
        this.isCreated = true;
        this._isEditing = false;
        this._test = test;
        this._form.patchValue(test);
        this._fetchGrades();
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: Couldn't find test.`);
      }
    );
  }

  ngOnInit() {
    this._fetchTest();
  }

  save(test: Test){
    if(this._isCreated){
      this._testsService.update(test).subscribe(
        () => { this._snackBarService.open(`Test updated.`); },
        () => {this._snackBarService.open(`Couldn't update the test.`); },
        () =>{this._isEditing = false;}
      );
    } else {
      this._testsService.create(test).subscribe(
        () => {this._snackBarService.open(`Created test with success.`); },
        () => { this._snackBarService.open(`Couldn't create the test.`); },
        () =>{this._isEditing = false;}
      );
    }
  }

  cancel(){
    this.isEditing = false;
    if(!this._isCreated){
      this._location.back();
    }
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
