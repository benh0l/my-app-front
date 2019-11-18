import { Component, OnInit } from '@angular/core';
import { filter, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../shared/interfaces/group';
import {GroupsService} from '../shared/services/groups.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {Lesson} from '../shared/interfaces/lesson';
import {LessonsService} from '../shared/services/lessons.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [GroupsService, LessonsService, CustomValidatorsService]
})
export class GroupComponent implements OnInit {
  private _group: Group;
  private _lessons: Lesson[];
  private _isCreated: boolean;
  private _isEditing: boolean;
  // private property to store form value
  private readonly _form: FormGroup;

  constructor(private _route: ActivatedRoute, private _groupsService: GroupsService, private _lessonsService: LessonsService, private _customValidatorsService: CustomValidatorsService) {
    this._group = {} as Group;
    this._isCreated = false;
    this._isEditing = false;
    this._form = this._buildForm();
  }


  get group(): Group{
    return this._group;
  }

  get isCreated(): boolean{
    return this._isCreated;
  }

  get isEditing(): boolean{
    return this._isEditing;
  }
  get form(): FormGroup {
    return this._form;
  }

  get lessons(): Lesson[]{
    console.log("Lesson asked " +this._lessons);
    return this._lessons;
  }

  ngOnInit() {
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._groupsService.fetchOne(params.id)),
      tap(_ => {this._isCreated = true;})
    ).subscribe((group: any) => {
      this._group = group;
      console.log("Found group");

      this._lessonsService
      .fetchMultiple(this._group.studentsId).subscribe(
        (lessons: Lesson[]) => {

          console.log("Found lesson "+lessons);
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
      id: new FormControl('0'),
      name: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
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
