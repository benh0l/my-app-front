import { Injectable } from '@angular/core';
import {MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';

@Injectable()
export class SnackBarService {
  private readonly DEFAULT_ACTION: string = 'cancel';
  private readonly DEFAULT_DURATION: number = 4000;
  private readonly DEFAULT_HORIZONTAL_POSITION: MatSnackBarHorizontalPosition = 'left';
  private readonly DEFAULT_VERTICAL_POSITION: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _snackBar: MatSnackBar) { }

  open(message: string) {
    this._snackBar.open(
      message,
      this.DEFAULT_ACTION,
      {
        duration: this.DEFAULT_DURATION,
        horizontalPosition: this.DEFAULT_HORIZONTAL_POSITION,
        verticalPosition: this.DEFAULT_VERTICAL_POSITION,
    });
  }
}
