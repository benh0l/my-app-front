import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Group } from '../shared/interfaces/group';
import {Router} from '@angular/router';
import {GroupsService} from '../shared/services/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  private _groups: Group[];

  constructor(private _router: Router, private _groupsService: GroupsService) {
    this._groups = [];
  }

  public dataSource(): MatTableDataSource<Group>{
    return new MatTableDataSource(this._groups);
  }

  ngOnInit() {
  }

}
