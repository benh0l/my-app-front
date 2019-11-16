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
  public readonly DISPLAYED_COLUMNS: string[] = [
    'id',
    'name',
    'startDate',
    'endDate',
    'studentsId',
    'responsibleId',
    'lessonsId'
  ]
  private _groups: Group[];
  private _dataSource: MatTableDataSource<Group>;

  constructor(private _router: Router, private _groupsService: GroupsService) {
    this._groups = [];
  }

  get dataSource(): MatTableDataSource<Group>{
    return this._dataSource;
  }

  ngOnInit() {
    this._groupsService
      .fetch().subscribe((groups: Group[]) => this._groups = groups);
    this._dataSource = new MatTableDataSource<Group>(this._groups);
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }
}
