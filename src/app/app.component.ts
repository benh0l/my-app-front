import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {SpinnerService} from './shared/services/spinner.service';
import { environment } from '../environments/environment';
import {GroupsService} from './shared/services/groups.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Title]
})
export class AppComponent {
  private appName = environment.appName;
  private _isLoading: boolean = true;
  /**
   * Component constructor
   */
  constructor(private _router: Router, private _matIconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer, private _spinnerService: SpinnerService, private _changeDetectorRef: ChangeDetectorRef, private titleService: Title) {
    this._spinnerService.spinnerToggled$.subscribe((status) => {
      this._isLoading = status;
      this._changeDetectorRef.detectChanges();
    });
    this.titleService.setTitle(this.appName);
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
    this._matIconRegistry.addSvgIcon('icon-add-note', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-add-note.svg'));
    this._matIconRegistry.addSvgIcon('icon-create', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-create.svg'));
    this._matIconRegistry.addSvgIcon('icon-delete', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-delete.svg'));
    this._matIconRegistry.addSvgIcon('icon-edit', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-edit.svg'));
    this._matIconRegistry.addSvgIcon('icon-close', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-close.svg'));
    this._matIconRegistry.addSvgIcon('icon-check', this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-check.svg'));
  }
}
