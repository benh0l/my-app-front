import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatIconRegistry,
  MatSelectModule,
  MatDialogModule,
  MatSnackBarModule, MatProgressSpinnerModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student/student.component';
import { GroupComponent } from './group/group.component';
import { GroupsComponent } from './groups/groups.component';
import { LessonComponent } from './lesson/lesson.component';
import {BackendService} from './shared/services/backend.service';
import { LessonsComponent } from './lessons/lessons.component';
import { UserComponent } from './user/user.component';
import { TestComponent } from './test/test.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import {SnackBarService} from './shared/services/snackbar.service';
import {SpinnerService} from './shared/services/spinner.service';
import { TestsComponent } from './tests/tests.component';
import { UsersComponent } from './users/users.component';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { UserNamePipe } from './shared/pipes/user-name.pipe';
import { GradesComponent } from './grades/grades.component';
import { GradeComponent } from './grade/grade.component';
import { KonamiModule } from 'ngx-konami';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudentComponent,
    GroupComponent,
    GroupsComponent,
    LessonComponent,
    LessonsComponent,
    UserComponent,
    TestComponent,
    TestsComponent,
    ConfirmComponent,
    DialogComponent,
    UsersComponent,
    CapitalizePipe,
    UserNamePipe,
    GradesComponent,
    GradeComponent,
  ],
  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    KonamiModule
  ],
  providers: [SnackBarService, BackendService, SpinnerService, CapitalizePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }




