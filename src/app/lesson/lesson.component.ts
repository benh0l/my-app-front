import { Component, OnInit } from '@angular/core';
import {Lesson} from '../shared/interfaces/lesson';
import { Test } from '../shared/interfaces/test';
import {MatTableDataSource} from '@angular/material';
import {Router, ActivatedRoute} from '@angular/router';
import {GroupsService} from '../shared/services/groups.service';
import {TestsService} from '../shared/services/tests.service';
import {LessonsService} from '../shared/services/lessons.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {flatMap, tap, filter} from 'rxjs/operators';
import {SnackBarService} from '../shared/services/snackbar.service';
import { Location } from '@angular/common';
import {SpinnerService} from '../shared/services/spinner.service';
import {DialogComponent} from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
  providers: [LessonsService, TestsService, CustomValidatorsService, MatDialog]
})
export class LessonComponent implements OnInit {
  public readonly VIEW_WATCH = 'watch';
  public readonly VIEW_EDIT = 'edit';
  private readonly  DIALOG_ACTIVE : string = 'active';
  private readonly  DIALOG_INACTIVE : string = 'inactive';
  private _confirmDialog: MatDialogRef<DialogComponent>;
  private _dialogStatus: string;
  private _lesson = {} as Lesson;
  private _dataSource: MatTableDataSource<Lesson>;
  private _view: string;
  private _isCreated: boolean;
  private _isEditing: boolean;
  private readonly _form: FormGroup;
  private _tests: Test[];

  constructor(private _router: Router, private _lessonsService: LessonsService, private _testsService: TestsService, private _route: ActivatedRoute, private _customValidatorsService: CustomValidatorsService, private _snackBarService: SnackBarService, private _spinnerService: SpinnerService, private _location: Location, private _dialog: MatDialog) {
    this._dialogStatus = this.DIALOG_INACTIVE;
    this._lesson = {} as Lesson;
    this._isCreated = false;
    this._isEditing = false;
    this._form = this._buildForm();
  }

  get dataSource(): MatTableDataSource<Lesson>{
    return this._dataSource;
  }

  get lesson(): Lesson{
    return this._lesson;
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


  get tests(): Test[]{
    return this._tests;
  }


  set isEditing(_ : boolean){
    this._isEditing = _;
  }

  save(lesson: Lesson){
    if(this._isCreated){
      this._lessonsService.update(lesson).subscribe(
        () => { this._snackBarService.open(`Lesson updated.`); },
        () => {this._snackBarService.open(`Couldn't update the lesson.`); },
        () =>{this._isEditing = false;}
      );
    } else {
      this._lessonsService.create(lesson).subscribe(
        () => {this._snackBarService.open(`Created lesson with success.`); },
        () => { this._snackBarService.open(`Couldn't create the lesson.`); },
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

  ngOnInit() {
    this._spinnerService.start();
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._lessonsService.fetchOne(params.id)),
      tap(_ => {this._isCreated = true; this._isEditing = false;})
    ).subscribe((lesson: any) => {
        this._lesson = lesson;
        this._form.patchValue(lesson);

        this._testsService
          .fetchMultiple(this._lesson.testsId).subscribe(
            (tests: Test[]) => {
            this._tests = tests;
            this._spinnerService.stop();
          },
          () => {
            this._spinnerService.stop();
            this._snackBarService.open(`Error: Couldn't load tests from group '${this._lesson.id}`);
          },
        );

      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: Couldn't find group '${this._lesson.id}`);
      }
    );
    /*
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._lessonsService.fetchOne(params.id)),
      tap(_ => {this._isCreated = true;})
    ).subscribe((lesson: any) => {
      this._lesson = lesson;

      this._form.patchValue(lesson);

      this._testsService
        .fetchMultiple(this._lesson.testsId).subscribe(
        (tests: Test[]) => {
          this._tests = tests;},
        () => {this._snackBarService.open(`Error: Couldn't load tests from lessons '${this._lesson.id}'.`); },
      );
  },
      () => {this._snackBarService.open(`Error: Couldn't find lesson '${this._lesson.id}'.`); },
      () => {console.log("complete: "+this._tests);}
    );
    */
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
        name: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(3)
        ])),
        teacherId: new FormControl('', Validators.compose([
          Validators.required
        ])),
        groupId: new FormControl('', Validators.compose([
          Validators.required
        ]))
      });
  }

  delete() {
    this._dialogStatus = this.DIALOG_ACTIVE;

    this._confirmDialog = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true
    });
    this._confirmDialog.componentInstance.title = `Delete lesson #${this._lesson.id}`;
    this._confirmDialog.componentInstance.sentence = `Are you sure to delete the lesson named ${this._lesson.name}`;
    this._confirmDialog.componentInstance.confirmObject = this._lesson;

    this._confirmDialog.afterClosed()
      .pipe(
        filter(_ => !!_),
        flatMap((_) => {
          this._spinnerService.start();
          return this._lessonsService.delete((_ as Lesson).id);
        })
      )
      .subscribe(
        () => {
          this._spinnerService.stop();
          this._snackBarService.open(`Deleted with success.`);
        },
        () => {
          this._dialogStatus = this.DIALOG_INACTIVE;
          this._spinnerService.stop();
          this._snackBarService.open(`Error: couldn't delete lesson.`);
        },
        () => this._dialogStatus = this.DIALOG_INACTIVE
      );
  }

}
