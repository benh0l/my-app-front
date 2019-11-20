import { Component, OnInit } from '@angular/core';
import {Grade} from '../shared/interfaces/grade';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {SnackBarService} from '../shared/services/snackbar.service';
import {SpinnerService} from '../shared/services/spinner.service';
import {GradesService} from '../shared/services/grades.service';
import {DialogComponent} from '../shared/dialog/dialog.component';
import {filter, flatMap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {User} from '../shared/interfaces/user';
import {Test} from '../shared/interfaces/test';
import {merge, of} from 'rxjs';
import {UsersService} from '../shared/services/users.service';
import {Lesson} from '../shared/interfaces/lesson';
import {TestsService} from '../shared/services/tests.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css'],
  providers: [Location, GradesService, UsersService, TestsService]
})
export class GradeComponent implements OnInit {
  private readonly  DIALOG_ACTIVE : string = 'active';
  private readonly  DIALOG_INACTIVE : string = 'inactive';
  private _dialogStatus: string;
  private _confirmDialog: MatDialogRef<DialogComponent>;
  private _isCreated: boolean;
  private  _isEditing: boolean;
  private  _grade: Grade;
  private readonly _form: FormGroup;
  private _users: User[];
  private _tests: Test[];

  constructor(private _route: ActivatedRoute, private _location: Location, private _dialog: MatDialog, private _snackBarService: SnackBarService, private _spinnerService: SpinnerService, private _gradesService: GradesService, private _usersService: UsersService, private _testsService: TestsService) {
    this._form = this._buildForm();
  }


  get tests(): Test[]{
    return this._tests;
  }
  get users(): User[]{
    return this._users;
  }

  private _fetchTests(){
    this._spinnerService.start();
    merge(
      of(this._tests).pipe(
        filter(_ => !!_),
        flatMap( _ => of(this._tests))
      ),
      of(this._tests).pipe(
        filter(_ => !_),
        flatMap( _ => this._testsService.fetch())
      )
    ).subscribe(
      (tests: Test[]) => {
        this._tests = tests;
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: couldn't fetch tests`);
      }
    );
  }
  private _fetchUsers(){
    this._spinnerService.start();
    merge(
      of(this._users).pipe(
        filter(_ => !!_),
        flatMap( _ => of(this._users))
      ),
      of(this._users).pipe(
        filter(_ => !_),
        flatMap( _ => this._usersService.fetch())
      )
    ).subscribe(
      (users: User[]) => {
        this._users = users;
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: couldn't fetch users`);
      }
    );
  }
  private _fetchGrade(){
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => {
        this._spinnerService.start();
        return this._gradesService.fetchOne(params.id);
      })
    ).subscribe((grade: any) => {
        this._isCreated = true;
        this._isEditing = false;
        this._grade = grade;
        this._form.patchValue(grade);
        this._fetchUsers();
        this._fetchTests();
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: Couldn't find test.`);
      }
    );
    this._route.params.pipe(
      filter(params => !!params.testId),
      flatMap(params => {
        this._spinnerService.start();
        return of({
          testId: params.testId
        } as Grade)
      })
    ).subscribe((grade: any) => {
        this._isCreated = false;
        this._isEditing = true;
        this._grade = grade;
        this._form.patchValue(grade);
        this._fetchUsers();
        this._fetchTests();
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: Couldn't find test.`);
      }
    );
  }

  ngOnInit() {
    this._fetchGrade();
  }

  get form(): FormGroup {
    return this._form;
  }

  get isEditing(): boolean{
    return this._isEditing
  }
  get isCreated(): boolean{
    return this._isCreated
  }
  get grade(): Grade{
    return this._grade;
  }
  save(grade: Grade){
    if(this._isCreated){
      this._gradesService.update(grade).subscribe(
        () => { this._snackBarService.open(`Grade updated.`); },
        () => {this._snackBarService.open(`Couldn't update the grade.`); },
        () =>{this._isEditing = false;}
      );
    } else {
      this._gradesService.create(grade).subscribe(
        () => {this._snackBarService.open(`Created grade with success.`); },
        () => { this._snackBarService.open(`Couldn't create the grade.`); },
        () =>{this._isEditing = false;}
      );
    }
  }

  delete() {
    this._dialogStatus = this.DIALOG_ACTIVE;

    this._confirmDialog = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true
    });
    this._confirmDialog.componentInstance.title = `Delete grade #${this._grade.id}`;
    this._confirmDialog.componentInstance.sentence = `Are you sure to delete this grade ?`;
    this._confirmDialog.componentInstance.confirmObject = this._grade;

    this._confirmDialog.afterClosed()
      .pipe(
        filter(_ => !!_),
        flatMap((_) => {
          this._spinnerService.start();
          return this._gradesService.delete((_ as Grade).id);
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
          this._snackBarService.open(`Error: couldn't delete grade.`);
        },
        () => this._dialogStatus = this.DIALOG_INACTIVE
      );
  }

  cancel(){
    this._isEditing = false;
    if(!this._isCreated){
      this._location.back();
    }
  }

  private _buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl( '0'),
      userId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      testId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      value: new FormControl('', Validators.compose([
        Validators.required, Validators.min(0), Validators.max(20)
      ]))
    });
  }

}
