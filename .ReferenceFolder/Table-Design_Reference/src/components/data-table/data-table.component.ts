import { ChangeDetectionStrategy, Component, computed, inject, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  private dataService = inject(DataService);

  @ViewChild('scrollableHeader') scrollableHeader!: ElementRef<HTMLDivElement>;
  @ViewChild('frozenColumns') frozenColumns!: ElementRef<HTMLDivElement>;

  private headers = this.dataService.headers;
  private dataRows = computed(() => this.dataService.data().map(obj => Object.values(obj)));
  
  // Centralized column width configuration for perfect alignment using explicit pixel values.
  private readonly columnWidths: { [key: string]: number } = {
    'RK': 64,
    'PLAYER': 192,
    'POS': 80,
    'TM': 80,
    'AGE': 80,
    'G': 80,
    'FPTS': 96,
    'PPG': 96,
    'VALUE': 96,
    'SNP%': 96,
    'CAR': 80,
    'ruYDS': 96,
    'YPC': 80,
    'ruTD': 80,
    'REC': 80,
    'recYDS': 96,
    'TGT': 80,
    'YDS(t)': 96,
    'ruYPG': 96,
    'ELU': 80,
    'MTF/A': 96,
    'YCO/A': 96,
    'MTF': 80,
    'YCO': 96,
    'ru1D': 80,
    'recTD': 80,
    'rec1D': 80,
    'YAC': 96,
    'IMP/G': 96,
    'FPOE': 96,
    'CSTY%': 112,
    'CL': 80,
  };

  getColumnWidth(header: string): string {
    const width = this.columnWidths[header] || 96; // Default width 96px
    return `${width}px`;
  }

  // Data for frozen panes
  frozenHeaders = computed(() => this.headers().slice(0, 3));
  frozenBodyRows = computed(() => this.dataRows().map(row => row.slice(0, 3)));
  
  // Data for scrollable panes
  scrollableHeaders = computed(() => this.headers().slice(3));
  scrollableBodyRows = computed(() => this.dataRows().map(row => row.slice(3)));

  onScroll(event: Event): void {
    const target = event.target as HTMLDivElement;
    const { scrollLeft, scrollTop } = target;

    if (this.scrollableHeader?.nativeElement) {
      this.scrollableHeader.nativeElement.scrollLeft = scrollLeft;
    }
    if (this.frozenColumns?.nativeElement) {
      this.frozenColumns.nativeElement.scrollTop = scrollTop;
    }
  }
}