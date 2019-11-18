import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, from, forkJoin} from 'rxjs';
import { defaultIfEmpty, filter, mergeMap } from 'rxjs/operators';
import {Test} from '../interfaces/test';
import {BackendService} from './backend.service';



@Injectable()
export class TestsService {
  constructor(private _http: HttpClient, private _backendService: BackendService) {
  }

  fetch(): Observable<Test[]>{
    return this._http.get<Test[]>(this._backendService.URL.allTest)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchOne(id: string): Observable<Test> {
    return this._http.get<Test>(this._backendService.URL.oneTest.replace(':id', id));
  }

  fetchMultiple(ids: string[]): Observable<Test[]> {
    return forkJoin(from(ids).pipe(
      mergeMap( id => this.fetchOne(id))
    ));
  }

  create(test: Test): Observable<any> {
    return this._http.post<Test>(this._backendService.URL.allTest, test, this._backendService.options());
  }

  update(test: Test): Observable<any> {
    return this._http.put<Test>(this._backendService.URL.oneLesson.replace(':id', test.id), test, this._backendService.options());
  }
}
