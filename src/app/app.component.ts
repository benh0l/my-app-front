import { Component, OnInit } from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * Component constructor
   */
  constructor(private _matIconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer) {
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
