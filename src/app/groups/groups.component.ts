import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Group } from '../shared/interfaces/group';
import {Router} from '@angular/router';
import { of } from 'rxjs';
import {filter, flatMap} from 'rxjs/operators';
import {GroupsService} from '../shared/services/groups.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DialogComponent} from '../shared/dialog/dialog.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  providers: [GroupsService, MatDialog]
})
export class GroupsComponent implements OnInit {
  private readonly  DIALOG_ACTIVE : string = 'active';
  private readonly  DIALOG_INACTIVE : string = 'inactive';
  private _dialogStatus: string;
  private _confirmDialog: MatDialogRef<DialogComponent>;
  private _groups: Group[];
  private _dataSource: MatTableDataSource<Group>;

  constructor(private _router: Router, private _groupsService: GroupsService, private _dialog: MatDialog) {
    this._dialogStatus = this.DIALOG_INACTIVE;
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

  delete(group: Group) {
    this._dialogStatus = this.DIALOG_ACTIVE;

    this._confirmDialog = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true
    });
    this._confirmDialog.componentInstance.title = `Delete group #${group.id}`;
    this._confirmDialog.componentInstance.sentence = `Are you sure to delete the group named ${group.name}`;
    this._confirmDialog.componentInstance.confirmObject = group;

    this._confirmDialog.afterClosed()
      .pipe(
        filter(_ => !!_),
        flatMap(_ => this._groupsService.delete((_ as Group).id))
      )
      .subscribe(
        () => {alert(`Deleted with success`);},
        () => {
          this._dialogStatus = this.DIALOG_INACTIVE;
          alert(`Error: couldn't delete group.`);
        },
        () => this._dialogStatus = this.DIALOG_INACTIVE
      );
  }
}
