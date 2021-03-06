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
    let observables = [];
    for(var i = 0; i < ids.length; i++)
      observables.push(this.fetchOne(ids[i]));
    return forkJoin(observables);
  }

  create(test: Test): Observable<any> {
    delete test.id;
    return this._http.post<Test>(this._backendService.URL.allTest, test, this._backendService.options());
  }

  update(test: Test): Observable<any> {
    let id = test.id;
    delete test.id;
    return this._http.put<Test>(this._backendService.URL.oneTest.replace(':id', id), test, this._backendService.options());
  }
}
