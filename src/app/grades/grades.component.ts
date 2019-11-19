import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Group} from '../shared/interfaces/group';
import {Grade} from '../shared/interfaces/grade';
import {Lesson} from '../shared/interfaces/lesson';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  private _grades: Grade[];
  private _dataSource: MatTableDataSource<Grade>;

  @Input()
  set grades(grades: Grade[]){
    this._grades = grades;
    this._dataSource.data = this._grades;
  }

  get grades(){
    return this._grades;
  }

  constructor() {
    this._grades = [];
    this._dataSource = new MatTableDataSource<Grade>();
  }

  get dataSource(): MatTableDataSource<Grade>{
    return this._dataSource;
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string){
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

}
