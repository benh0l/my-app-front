import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Lesson} from '../shared/interfaces/lesson';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {SnackBarService} from '../shared/services/snackbar.service';
import {of} from 'rxjs';
import {filter} from 'rxjs/operators';
import {User} from '../shared/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private _users: User[];
  private _dataSource: MatTableDataSource<User>;
  private readonly _remove$: EventEmitter<User>;

  @Input()
  set users(users: User[]){
    console.log("USERS",users);
    this._users = users;
    this._dataSource.data = this._users;
  }

  get users(){
    return this._users;
  }

  constructor(private _router: Router, private _snackBarService: SnackBarService) {
    this._users = [];
    this._dataSource = new MatTableDataSource<User>();
  }

  get dataSource(): MatTableDataSource<User>{
    return this._dataSource;
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  remove(user: User){
    this._remove$.emit(user);
  }

  goToUser(userId: string){
    of(userId)
      .pipe(
        filter(_ => !!_)
      )
      .subscribe(_ => this._router.navigate(['/user', _]),
        () => {this._snackBarService.open(`Couldn't navigate to the user page.`); }
      );
  }
}
