import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Group } from '../shared/interfaces/group';
import {Router} from '@angular/router';
import { of } from 'rxjs';
import {filter, flatMap} from 'rxjs/operators';
import {GroupsService} from '../shared/services/groups.service';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogComponent} from '../shared/dialog/dialog.component';
import {Location} from '@angular/common';
import {SnackBarService} from '../shared/services/snackbar.service';
import {SpinnerService} from '../shared/services/spinner.service';

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

  constructor(private _router: Router, private _groupsService: GroupsService, private _dialog: MatDialog, private _snackBarService: SnackBarService, private _spinnerService: SpinnerService) {
    this._dialogStatus = this.DIALOG_INACTIVE;
    this._groups = [];
  }

  get dataSource(): MatTableDataSource<Group>{
    return this._dataSource;
  }

  ngOnInit() {
    this._spinnerService.start();
    this._dataSource = new MatTableDataSource<Group>();
    this._groupsService
      .fetch().subscribe((groups: Group[]) => this._groups = groups,
      () => {
        this._snackBarService.open(`Couldn't access to the groups list.`);
        this._spinnerService.stop();
        },
      () => {
        this._dataSource.data = this._groups;
        this._spinnerService.stop();
        }
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
      .subscribe(
        _ => this._router.navigate(['/group', _]),
        () => { this._snackBarService.open(`Couldn't navigate to the group page.`); }
      );
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
        flatMap((_) => {
          this._spinnerService.start();
          return this._groupsService.delete((_ as Group).id);
          }
        )
      )
      .subscribe(
        () => {
          this._spinnerService.stop();
          this._snackBarService.open(`Deleted with success.`); },
        () => {
          this._dialogStatus = this.DIALOG_INACTIVE;
          this._spinnerService.stop();
          this._snackBarService.open(`Couldn't delete the group.`);
        },
        () => this._dialogStatus = this.DIALOG_INACTIVE
      );
  }
}
