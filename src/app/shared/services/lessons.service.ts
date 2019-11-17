import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import {Lesson} from '../interfaces/lesson';

@Injectable()
export class LessonsService {
  // private property to store all backend URLs
  private readonly _backendURL: any;

  constructor(private _http: HttpClient) {
    this._backendURL = {};

    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;

      // build all backend urls
      Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[k] = `${baseUrl}${environment.backend.endpoints[k]}`);
    }
  }

  fetch(): Observable<Lesson[]>{
    return this._http.get<Lesson[]>(this._backendURL.allLesson)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchOne(id: string): Observable<Lesson> {
    return this._http.get<Lesson>(this._backendURL.oneLesson.replace(':id', id));
  }

  create(lesson: Lesson): Observable<any> {
    return this._http.post<Lesson>(this._backendURL.allLesson, lesson, this._options());
  }

  update(lesson: Lesson): Observable<any> {
    return this._http.put<Lesson>(this._backendURL.oneLesson.replace(':id', lesson.id), lesson, this._options());
  }

  private _options(headerList: object = {}): any {
    return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
  }
}
