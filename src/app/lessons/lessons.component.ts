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
import {UsersService} from '../shared/services/users.service';
import {SpinnerService} from '../shared/services/spinner.service';
import {User} from '../shared/interfaces/user';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css'],
  providers: [UsersService]
})
export class LessonsComponent implements OnInit {
  private _teachers: User[];
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

  constructor(private _router: Router, private _snackBarService: SnackBarService, private _spinnerService: SpinnerService, private _usersService: UsersService) {
    this._lessons = [];
    this._dataSource = new MatTableDataSource<Lesson>();
  }

  get dataSource(): MatTableDataSource<Lesson>{
    return this._dataSource;
  }

  ngOnInit() {
    const teachersId = [... new Set(this._lessons.map(_ => _.teacherId))];
    if(teachersId.length > 0) {
      this._spinnerService.start();
      this._usersService.fetchMultiple(teachersId).subscribe(
        (users) => {
          this._teachers = users;
          this._spinnerService.stop();
        },
      () =>{
          this._spinnerService.start();
          this._snackBarService.open(`Error: Couldn't load teachers`);
        }
      );
    }
  }

  getTeacher(id: string): User|string{
    if(!this._teachers)
      return id;
    const result = this._teachers.reduce(function(total, teacher){
      if(teacher.id == id)
        return teacher;
      return null;
    });
    if(!result)
      return id;
    return result;
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
