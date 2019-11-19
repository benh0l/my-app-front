import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Lesson } from '../shared/interfaces/lesson';
import {Router} from '@angular/router';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import {LessonsService} from '../shared/services/lessons.service';
import {Group} from '../shared/interfaces/group';
import {CustomValidatorsService} from '../shared/services/custom-validators.service';
import {SnackBarService} from '../shared/services/snackbar.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css'],
  providers: []
})
export class LessonsComponent implements OnInit {
  private _lessons: Lesson[];
  private _dataSource: MatTableDataSource<Lesson>;

  @Input()
  set lessons(lessons: Lesson[]){
    this._lessons = lessons;
    this._dataSource.data = this._lessons;
  }

  get lessons(){
    return this._lessons;
  }

  constructor(private _router: Router, private _snackBarService: SnackBarService) {
    this._lessons = [];
    this._dataSource = new MatTableDataSource<Lesson>();
  }

  get dataSource(): MatTableDataSource<Lesson>{
    return this._dataSource;
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToLesson(lessonId: string){
    of(lessonId)
      .pipe(
        filter(_ => !!_)
      )
      .subscribe(_ => this._router.navigate(['/lesson', _]),
        () => {this._snackBarService.open(`Couldn't navigate to the lesson page.`); }
        );
  }
}
