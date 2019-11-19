import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import {Group} from '../interfaces/group';
import {BackendService} from './backend.service';

@Injectable()
export class GroupsService {
  constructor(private _http: HttpClient, private _backendService: BackendService) {
  }

  fetch(): Observable<Group[]>{
    return this._http.get<Group[]>(this._backendService.URL.allGroup)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchOne(id: string): Observable<Group> {
    return this._http.get<Group>(this._backendService.URL.oneGroup.replace(':id', id));
  }

  create(group: Group): Observable<any> {
    delete group.id;
    return this._http.post<Group>(this._backendService.URL.allGroup, group, this._backendService.options());
  }

  update(group: Group): Observable<any> {
    let id = group.id;
    delete group.id;
    return this._http.put<Group>(this._backendService.URL.oneGroup.replace(':id', id), group, this._backendService.options());
  }

  deleteUser(groupId: string, userId: string): Observable<any>{
    return this._http.post(
      this._backendService.URL.deleteUserGroup.replace(':id', groupId),
      {studentId: userId},
      this._backendService.options()
    );
  }

  delete(id: string): Observable<string>{
    return this._http.delete(this._backendService.URL.oneGroup.replace(':id', id))
      .pipe(
        map(_ => id)
      );
  }
}
