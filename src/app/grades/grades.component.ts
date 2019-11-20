import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Group} from '../shared/interfaces/group';
import {Grade} from '../shared/interfaces/grade';
import {Lesson} from '../shared/interfaces/lesson';
import {DialogComponent} from '../shared/dialog/dialog.component';
import {filter, flatMap} from 'rxjs/operators';
import {SpinnerService} from '../shared/services/spinner.service';
import {SnackBarService} from '../shared/services/snackbar.service';
import {GradesService} from '../shared/services/grades.service';
import {of} from 'rxjs';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css'],
  providers: [GradesService]
})
export class GradesComponent implements OnInit {
  private readonly  DIALOG_ACTIVE : string = 'active';
  private readonly  DIALOG_INACTIVE : string = 'inactive';
  private _dialogStatus: string;
  private _confirmDialog: MatDialogRef<DialogComponent>;
  private _grades: Grade[];
  private _dataSource: MatTableDataSource<Grade>;

  @Input()
  set grades(grades: Grade[]){
    this._grades = grades;
    this._dataSource.data = this._grades;
  }

  get grades(){
    return this._grades;
  }

  constructor(private _router: Router, private _spinnerService: SpinnerService, private _snackBarService: SnackBarService, private _gradesService: GradesService, private _dialog: MatDialog) {
    this._grades = [];
    this._dataSource = new MatTableDataSource<Grade>();
  }

  get dataSource(): MatTableDataSource<Grade>{
    return this._dataSource;
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToGrade(groupId: string){
    of(groupId)
      .pipe(
        filter(_ => !!_)
      )
      .subscribe(
        _ => this._router.navigate(['/group', _]),
        () => { this._snackBarService.open(`Couldn't navigate to the group page.`); }
      );
  }

  delete(grade: Grade) {
    this._dialogStatus = this.DIALOG_ACTIVE;

    this._confirmDialog = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true
    });
    this._confirmDialog.componentInstance.title = `Delete grade #${grade.id}`;
    this._confirmDialog.componentInstance.sentence = `Are you sure to delete the grade`;
    this._confirmDialog.componentInstance.confirmObject = grade;

    this._confirmDialog.afterClosed()
      .pipe(
        filter(_ => !!_),
        flatMap((_) => {
            this._spinnerService.start();
            return this._gradesService.delete((_ as Grade).id);
          }
        )
      )
      .subscribe(
        (deletedId) => {
          this._grades = this._grades.filter(grade => grade.id != deletedId)
          this._spinnerService.stop();
          this._snackBarService.open(`Deleted with success.`);
        },
        () => {
          this._dialogStatus = this.DIALOG_INACTIVE;
          this._spinnerService.stop();
          this._snackBarService.open(`Couldn't delete the grade.`);
        },
        () => this._dialogStatus = this.DIALOG_INACTIVE
      );
  }
}
