import { Component, OnInit } from '@angular/core';
import { filter, flatMap, tap } from 'rxjs/operators';
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

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [GroupsService, LessonsService, UsersService, CustomValidatorsService, Location]
})
export class GroupComponent implements OnInit {
  private _group: Group;
  private _lessons: Lesson[];
  private _users: User[];
  private _isCreated: boolean;
  private _isEditing: boolean;
  // private property to store form value
  private readonly _form: FormGroup;

  constructor(private _route: ActivatedRoute, private _groupsService: GroupsService, private _lessonsService: LessonsService, private _usersService: UsersService, private _customValidatorsService: CustomValidatorsService, private _location: Location) {
    this._group = {} as Group;
    this._isCreated = false;
    this._isEditing = true;
    this._form = this._buildForm();
  }


  get group(): Group{
    return this._group;
  }
  get users(): User[]{
    return this._users;
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

  get lessons(): Lesson[]{
    return this._lessons;
  }
  set isEditing(_ : boolean){
    this._isEditing = _;
  }

  save(group: Group){
    if(this._isCreated){
      this._groupsService.update(group).subscribe(
        () => {alert('Group updated') },
      () => {alert('Error, couldn\'t update'); },
      () =>{this._isEditing = false;}
      );
    } else {
      this._groupsService.create(group).subscribe(
        () => {alert('Group created') },
        () => {alert('Error, couldn\'t create');
        },
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
    this._usersService.fetch().subscribe(
      (users: User[]) => {
        console.log("NEXT");
        this._users = users;
      },
      () => {
        console.log("ERROR");},
      () => {
        console.log("COMPLETE");}
    );

    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._groupsService.fetchOne(params.id)),
      tap(_ => {this._isCreated = true; this._isEditing = false;})
    ).subscribe((group: any) => {
      this._group = group;

      this._form.patchValue(group);

      this._lessonsService
      .fetchMultiple(this._group.lessonsId).subscribe(
        (lessons: Lesson[]) => {
          this._lessons = lessons;},
        () => {console.log("Error: Couldn't load lessons from group '"+this._group.id+"'")},
        () => {console.log("Lesson completed"); }
      );

    },
      () => {console.log("Error: Couldn't find group '"+this._group.id+"'.");},
      () => {console.log("complete: "+this._lessons);}
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

}
