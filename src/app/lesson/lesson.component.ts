import { Component, OnInit } from '@angular/core';
import {Lesson} from '../shared/interfaces/lesson';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {GroupsService} from '../shared/services/groups.service';
import {LessonsService} from '../shared/services/lessons.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
  providers: [LessonsService]
})
export class LessonComponent implements OnInit {
  public readonly VIEW_WATCH = 'watch';
  public readonly VIEW_EDIT = 'edit';
  private _lessons: Lesson[];
  private _dataSource: MatTableDataSource<Lesson>;
  private _view: string;

  constructor(private _router: Router, private _lessonsService: LessonsService) {
    this._lessons = [];
  }

  get dataSource(): MatTableDataSource<Lesson>{
    return this._dataSource;
  }

  ngOnInit() {
    this._dataSource = new MatTableDataSource<Lesson>();
    this._lessonsService
      .fetch().subscribe((lessons: Lesson[]) => this._lessons = lessons,
      () => {},
      () => { this._dataSource.data = this._lessons; }
    );
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  switchView(){
    this._view = (this._view === this.VIEW_WATCH) ? this.VIEW_EDIT : this.VIEW_WATCH;
  }

}
