import { Component, OnInit } from '@angular/core';
import {filter, flatMap, map, tap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Group } from '../shared/interfaces/group';
import {GroupsService} from '../shared/services/groups.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {Lesson} from '../shared/interfaces/lesson';
import {LessonsService} from '../shared/services/lessons.service';
import {User} from '../shared/interfaces/user';
import {UsersService} from '../shared/services/users.service';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogComponent} from '../shared/dialog/dialog.component';
import {SnackBarService} from '../shared/services/snackbar.service';
import {SpinnerService} from '../shared/services/spinner.service';
import {of, merge, Observable, from} from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [GroupsService, LessonsService, UsersService, CustomValidatorsService, Location]
})
export class GroupComponent implements OnInit {
  private readonly  DIALOG_ACTIVE : string = 'active';
  private readonly  DIALOG_INACTIVE : string = 'inactive';
  private _dialogStatus: string;
  private _confirmDialog: MatDialogRef<DialogComponent>;
  private _group: Group;
  private _lessons: Lesson[];
  private _users: User[]
  private _students: User[];
  private _isCreated: boolean;
  private _isEditing: boolean;
  // private property to store form value
  private readonly _form: FormGroup;

  constructor(private _route: ActivatedRoute, private _groupsService: GroupsService, private _lessonsService: LessonsService, private _usersService: UsersService, private _customValidatorsService: CustomValidatorsService, private _location: Location, private _dialog: MatDialog, private _snackBarService: SnackBarService, private _spinnerService: SpinnerService) {
    this._dialogStatus = this.DIALOG_INACTIVE;
    this._group = {} as Group;
    this.isCreated = false;
    this._isEditing = true;
    this._form = this._buildForm();
  }


  get group(): Group{
    return this._group;
  }
  get users(): User[]{
    return this._users;
  }

  get students(): User[]{
    return this._students;
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

  get lessons(): Lesson[]{
    return this._lessons;
  }
  set isEditing(_ : boolean){
    this._isEditing = _;
  }

  save(group: Group){
    if(this._isCreated){
      this._groupsService.update(group).subscribe(
        () => { this._snackBarService.open(`Group updated.`); },
      () => {this._snackBarService.open(`Couldn't update the group.`); },
      () =>{this._isEditing = false;}
      );
    } else {
      this._groupsService.create(group).subscribe(
        () => {this._snackBarService.open(`Created group with success.`); },
        () => { this._snackBarService.open(`Couldn't create the group.`); },
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
  private _fetchLessons(){
    this._spinnerService.start();
    this._lessonsService
      .fetchMultiple(this._group.lessonsId).subscribe(
      (lessons: Lesson[]) => {
        this._lessons = lessons;
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: Couldn't load lessons from group '${this._group.id}`);
      },
    );
  }

  private _fetchStudents(){
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
        this._students = this._users.filter(
          user => this._group.studentsId.includes(user.id)
        )
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: couldn't fetch students`);
      }
    );
  }

  private _fetchGroup(){
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => {
        this._spinnerService.start();
        return this._groupsService.fetchOne(params.id);
      })
    ).subscribe((group: any) => {
        this._isCreated = true;
        this._isEditing = false;
        this._group = group;
        this._form.patchValue(group);
        this._fetchLessons();
        this._fetchStudents();
        this._spinnerService.stop();
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: Couldn't find group.`);
      }
    );
  }

  ngOnInit() {
    this._spinnerService.start();
    this._usersService.fetch().subscribe(
      (users: User[]) => {
        this._users = users;
        this._fetchGroup();
        this._spinnerService.stop();
      },
      () => {
        this._snackBarService.open(`Couldn't access to the users list.`);
        this._spinnerService.stop();
      }
    );
  }

  private _buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl( '0'),
      name: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])),
      responsibleId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      startDate: new FormControl('', Validators.compose([
        Validators.required
      ])),
      endDate: new FormControl('', Validators.compose([
        Validators.required
      ]))
    }, {
      validators: [
        this._customValidatorsService.startBeforeEnd('startDate', 'endDate'),
      ]
    });
  }

  onRemove(user: User){
    this._spinnerService.start();
    this._groupsService.deleteUser(this._group.id, user.id).subscribe(
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`User was removed with success.`);
      },
      () => {
        this._spinnerService.stop();
        this._snackBarService.open(`Error: couldn't remove user.`);
      }
    );
  }

  delete() {
    this._dialogStatus = this.DIALOG_ACTIVE;

    this._confirmDialog = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true
    });
    this._confirmDialog.componentInstance.title = `Delete group #${this._group.id}`;
    this._confirmDialog.componentInstance.sentence = `Are you sure to delete the group named ${this._group.name}`;
    this._confirmDialog.componentInstance.confirmObject = this._group;

    this._confirmDialog.afterClosed()
      .pipe(
        filter(_ => !!_),
        flatMap((_) => {
          this._spinnerService.start();
          return this._groupsService.delete((_ as Group).id);
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
          this._snackBarService.open(`Error: couldn't delete group.`);
          },
        () => this._dialogStatus = this.DIALOG_INACTIVE
      );
  }

}
