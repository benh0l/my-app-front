import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GroupComponent} from './group/group.component';
import {GroupsComponent} from './groups/groups.component';
import {StudentComponent} from './student/student.component';
import {LessonComponent} from './lesson/lesson.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'group/new', component: GroupComponent },
  { path: 'group/:id', component: GroupComponent },
  { path: 'student/:id', component: StudentComponent },
  { path: 'lesson/:id', component: LessonComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
