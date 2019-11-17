import { Component, OnInit } from '@angular/core';
import { filter, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../shared/interfaces/group';
import {GroupsService} from '../shared/services/groups.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [GroupsService, CustomValidatorsService]
})
export class GroupComponent implements OnInit {
  private _group: Group;
  private _isCreated: boolean;
  // private property to store form value
  private readonly _form: FormGroup;

  constructor(private _route: ActivatedRoute, private _groupsService: GroupsService, private _customValidatorsService: CustomValidatorsService) {
    this._group = {} as Group;
    this._isCreated = false;
    this._form = this._buildForm();
  }


  get group(): Group{
    return this._group;
  }

  get isCreated(): boolean{
    return this._isCreated;
  }
  get form(): FormGroup {
    return this._form;
  }

  ngOnInit() {
    this._route.params.pipe(
      filter(params => !!params.id),
      flatMap(params => this._groupsService.fetchOne(params.id)),
      tap(_ => this._isCreated = true)
    ).subscribe((group: any) => this._group = group);
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
