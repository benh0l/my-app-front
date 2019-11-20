import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Lesson} from '../shared/interfaces/lesson';
import {MatTableDataSource, MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {SnackBarService} from '../shared/services/snackbar.service';
import {of} from 'rxjs';
import {filter} from 'rxjs/operators';
import {User} from '../shared/interfaces/user';
import {SpinnerService} from '../shared/services/spinner.service';
import {UsersService} from '../shared/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UsersService, MatDialog]
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

  constructor(private _router: Router, private _snackBarService: SnackBarService,  private _spinnerService: SpinnerService, private _usersService: UsersService) {
    this._users = [];
    this._dataSource = new MatTableDataSource<User>();
    this._remove$ = new EventEmitter<User>();
  }

  get dataSource(): MatTableDataSource<User>{
    return this._dataSource;
  }

  ngOnInit() {
    this._spinnerService.start();
    this._usersService
      .fetch().subscribe((users: User[]) => this._users = users,
      () => {
        this._snackBarService.open(`Couldn't access to the users list.`);
        this._spinnerService.stop();
      },
      () => {
        this._dataSource.data = this._users;
        this._spinnerService.stop();
      }
    );
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  @Output('remove')
  get remove$(): EventEmitter<User> {
    return this._remove$;
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
