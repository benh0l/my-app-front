import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, from, forkJoin} from 'rxjs';
import { defaultIfEmpty, filter, mergeMap, map } from 'rxjs/operators';
import {Lesson} from '../interfaces/lesson';
import {BackendService} from './backend.service';

@Injectable()
export class LessonsService {
  constructor(private _http: HttpClient, private _backendService: BackendService) {
  }

  fetch(): Observable<Lesson[]>{
    return this._http.get<Lesson[]>(this._backendService.URL.allLesson)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchOne(id: string): Observable<Lesson> {
    return this._http.get<Lesson>(this._backendService.URL.oneLesson.replace(':id', id));
  }

  fetchMultiple(ids: string[]): Observable<Lesson[]> {
    return forkJoin(from(ids).pipe(
      mergeMap( id => this.fetchOne(id))
    ));
  }

  create(lesson: Lesson): Observable<any> {
    delete lesson.id;
    return this._http.post<Lesson>(this._backendService.URL.allLesson, lesson, this._backendService.options());
  }

  update(lesson: Lesson): Observable<any> {
    let id = lesson.id;
    delete lesson.id;
    return this._http.put<Lesson>(this._backendService.URL.oneLesson.replace(':id', id), lesson, this._backendService.options());
  }

  delete(id: string): Observable<string>{
    return this._http.delete(this._backendService.URL.oneLesson.replace(':id', id))
      .pipe(
        map(_ => id)
      );
  }
}
