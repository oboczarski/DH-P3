
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataTableComponent } from './components/data-table/data-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [DataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
