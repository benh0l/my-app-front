import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, from, forkJoin} from 'rxjs';
import { defaultIfEmpty, filter, mergeMap, map } from 'rxjs/operators';
import {BackendService} from './backend.service';
import {Grade} from '../interfaces/grade';

@Injectable()
export class GradesService {
  constructor(private _http: HttpClient, private _backendService: BackendService) {
  }

  fetch(): Observable<Grade[]>{
    return this._http.get<Grade[]>(this._backendService.URL.allGrade)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchOne(id: string): Observable<Grade> {
    return this._http.get<Grade>(this._backendService.URL.oneGrade.replace(':id', id));
  }

  fetchMultiple(ids: string[]): Observable<Grade[]> {
    let observables = [];
    for(var i = 0; i < ids.length; i++)
      observables.push(this.fetchOne(ids[i]));
    return forkJoin(observables);
  }

  create(grade: Grade): Observable<any> {
    delete grade.id;
    return this._http.post<Grade>(this._backendService.URL.allGrade, grade, this._backendService.options());
  }

  update(grade: Grade): Observable<any> {
    let id = grade.id;
    delete grade.id;
    return this._http.put<Grade>(this._backendService.URL.oneGrade.replace(':id', id), grade, this._backendService.options());
  }

  delete(id: string): Observable<string>{
    return this._http.delete(this._backendService.URL.oneGrade.replace(':id', id))
      .pipe(
        map(_ => id)
      );
  }
}
