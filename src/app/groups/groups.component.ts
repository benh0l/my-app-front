import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Group } from '../shared/interfaces/group';
import {Router} from '@angular/router';
import { of } from 'rxjs';
import {filter, flatMap} from 'rxjs/operators';
import {GroupsService} from '../shared/services/groups.service';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  providers: [GroupsService, MatDialog]
})
export class GroupsComponent implements OnInit {
  private _groups: Group[];
  private _dataSource: MatTableDataSource<Group>;

  constructor(private _router: Router, private _groupsService: GroupsService) {
    this._groups = [];
  }

  get dataSource(): MatTableDataSource<Group>{
    return this._dataSource;
  }

  ngOnInit() {
    this._dataSource = new MatTableDataSource<Group>();
    this._groupsService
      .fetch().subscribe((groups: Group[]) => this._groups = groups,
      () => {},
      () => { this._dataSource.data = this._groups; }
      );
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToGroup(groupId: string){
    of(groupId)
      .pipe(
        filter(_ => !!_)
      )
      .subscribe(_ => this._router.navigate(['/group', _]));
  }
  
}
