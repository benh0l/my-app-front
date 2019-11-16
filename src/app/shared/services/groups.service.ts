import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import {Group} from '../interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
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

  fetch(): Observable<Group[]>{
    return this._http.get<Group[]>(this._backendURL.allGroup)
      .pipe(
        filter(_ => !!_),
        defaultIfEmpty([])
      );
  }

  fetchOne(id: string): Observable<Group> {
    return this._http.get<Group>(this._backendURL.oneGroup.replace(':id', id));
  }

  create(group: Group): Observable<any> {
    return this._http.post<Group>(this._backendURL.allPeople, group, this._options());
  }

  update(group: Group): Observable<any> {
    return this._http.put<Group>(this._backendURL.onePeople.replace(':id', group.id), group, this._options());
  }

  private _options(headerList: object = {}): any {
    return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
  }
}
