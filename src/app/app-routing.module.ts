import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GroupComponent} from './group/group.component';
import {GroupsComponent} from './groups/groups.component';
import {StudentComponent} from './student/student.component';
import {LessonComponent} from './lesson/lesson.component';
import {TestComponent} from './test/test.component';
import {UsersComponent} from './users/users.component';
import {UserComponent} from './user/user.component';
import {GradeComponent} from './grade/grade.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'group/new', component: GroupComponent },
  { path: 'group/:id', component: GroupComponent },
  { path: 'student/:id', component: StudentComponent },
  { path: 'lesson/:id', component: LessonComponent },
  { path: 'lessons', component: LessonComponent },
  { path: 'test/:id', component: TestComponent },
  { path: 'grade/:id', component: GradeComponent },
  { path: 'grade/new/:testId', component: GradeComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
