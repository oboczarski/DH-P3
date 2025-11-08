import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DataTableComponent } from './data-table.component.js';

export const AppComponent = Component({
  standalone: true,
  selector: 'app-stats-table',
  imports: [DataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-data-table></app-data-table>`
})(class AppComponent {});
