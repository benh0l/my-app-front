import { Component, OnInit } from '@angular/core';
import {DialogComponent} from '../shared/dialog/dialog.component';
import {MatDialogRef, MatDialog, MatTableDataSource} from '@angular/material';
import {User} from '../shared/interfaces/user';
import {Group} from '../shared/interfaces/group';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import {GroupsService} from '../shared/services/groups.service';
import {LessonsService} from '../shared/services/lessons.service';
import {UsersService} from '../shared/services/users.service';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {SnackBarService} from '../shared/services/snackbar.service';
import {SpinnerService} from '../shared/services/spinner.service';
import {flatMap, filter, tap} from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UsersService, GroupsService, CustomValidatorsService]
})
export class UserComponent implements OnInit {
  public readonly VIEW_WATCH = 'watch';
  public readonly VIEW_EDIT = 'edit';
  private _dialogStatus: string;
  private _confirmDialog: MatDialogRef<DialogComponent>;
  private _user = {} as User;
  private _isCreated: boolean;
  private _isEditing: boolean;
  private readonly _form: FormGroup;
  private _dataSource: MatTableDataSource<User>;
  private _view: string;

  constructor(private _route: ActivatedRoute, private _groupsService: GroupsService, private _usersService: UsersService, private _customValidatorsService: CustomValidatorsService, private _location: Location, private _dialog: MatDialog, private _snackBarService: SnackBarService, private _spinnerService: SpinnerService) {
    this._user = {} as User;
    this._isCreated = false;
    this._isEditing = false;
    this._form = this._buildForm();
  }

  get dataSource(): MatTableDataSource<User>{
    return this._dataSource;
  }

  get user(): User{
    return this._user;
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

  set isEditing(_ : boolean){
    this._isEditing = _;
  }
  
  get form(): FormGroup {
    return this._form;
  }

  save(user: User){
    if(this._isCreated){
      this._usersService.update(user).subscribe(
        () => { this._snackBarService.open(`User updated.`); },
        () => {this._snackBarService.open(`Couldn't update the user.`); },
        () =>{this._isEditing = false;}
      );
    } else {
      this._usersService.create(user).subscribe(
        () => {this._snackBarService.open(`Created user with success.`); },
        () => { this._snackBarService.open(`Couldn't create the user.`); },
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
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._usersService.fetchOne(params.id)),
      tap(_ => {this._isCreated = true;})
    ).subscribe((user: any) => {
        this._user = user;
        this._form.patchValue(user);
      },
      () => {console.log("Error: Couldn't find user'"+this._user.id+"'.");},
      () => {console.log("complete: "+this._user);}
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
      firstname: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])),
      login: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
      ]))
    });
  }

}
