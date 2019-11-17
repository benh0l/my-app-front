import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import {Group} from '../interfaces/group';
import {BackendService} from './backend.service';

@Injectable()
export class GroupsService {
  // private property to store all backend URLs
  private readonly _backendURL: any;

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
    return this._http.post<Group>(this._backendService.URL.allGroup, group, this._options());
  }

  update(group: Group): Observable<any> {
    return this._http.put<Group>(this._backendService.URL.oneGroup.replace(':id', group.id), group, this._options());
  }

  private _options(headerList: object = {}): any {
    return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
  }
}
