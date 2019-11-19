import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {SpinnerService} from './shared/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _isLoading: boolean = true;
  /**
   * Component constructor
   */
  constructor(private _router: Router, private _matIconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer, private _spinnerService: SpinnerService, private _changeDetectorRef: ChangeDetectorRef) {
    this._spinnerService.spinnerToggled$.subscribe((status) => {
      console.log(`Loader status: ${status}`);
      this._isLoading = status;
      this._changeDetectorRef.detectChanges();
    });
    this._router.events
      .subscribe((event) => {
        if(event instanceof NavigationStart) {
          this._spinnerService.reset();
          this._spinnerService.start();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof NavigationCancel
        ) {
          this._spinnerService.stop();
        }
      });
  }

  get isLoading(): boolean{
    return this._isLoading;
  }

  /**
   * OnInit implementation
   */
  ngOnInit() {
    this._matIconRegistry.addSvgIcon('icon-create', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-create.svg'));
    this._matIconRegistry.addSvgIcon('icon-delete', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-delete.svg'));
    this._matIconRegistry.addSvgIcon('icon-edit', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-edit.svg'));
    this._matIconRegistry.addSvgIcon('icon-close', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-close.svg'));
    this._matIconRegistry.addSvgIcon('icon-check', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-check.svg'));
  }
}
