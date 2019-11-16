import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../shared/interfaces/group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  private _group: Group;

  constructor(private _route: ActivatedRoute) { }


  get group(): Group{
    return this._group;
  }

  ngOnInit() {
  }

}
