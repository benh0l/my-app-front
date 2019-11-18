import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import {User} from '../interfaces/user';
import {BackendService} from './backend.service';

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
