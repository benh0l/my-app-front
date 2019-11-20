import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {forkJoin, from, Observable} from 'rxjs';
import {defaultIfEmpty, filter, map, mergeMap} from 'rxjs/operators';
import {User} from '../interfaces/user';
import {BackendService} from './backend.service';
import {Lesson} from '../interfaces/lesson';

@Injectable()
export class UsersService {
  constructor(private _http: HttpClient, private _backendService: BackendService) {
  }

  fetch(): Observable<User[]>{
    return this._http.get<User[]>(this._backendService.URL.allUser)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchMultiple(ids: string[]): Observable<User[]> {
    let observables = [];
    for(var i = 0; i < ids.length; i++)
      observables.push(this.fetchOne(ids[i]));
    return forkJoin(observables);
  }

  fetchOne(id: string): Observable<User> {
    return this._http.get<User>(this._backendService.URL.oneUser.replace(':id', id));
  }

  create(user: User): Observable<any> {
    delete user.id;
    return this._http.post<User>(this._backendService.URL.allUser, user, this._backendService.options());
  }

  update(user: User): Observable<any> {
    let id = user.id;
    delete user.id;
    return this._http.put<User>(this._backendService.URL.oneUser.replace(':id', id), user, this._backendService.options());
  }
}
