import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBridgeService } from './table-bridge.service.js';

export const DataTableComponent = Component({
  standalone: true,
  selector: 'app-data-table',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-white/10 shadow-2xl shadow-black/40">
      <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-[70vh] max-h-[700px] rounded-xl overflow-hidden">
        <!-- Quadrant 1: Frozen Corner -->
        <div class="z-30 bg-[#13172c]/80 backdrop-blur-md border-b border-r border-white/5">
          <table class="table-fixed border-collapse">
            <thead>
              <tr>
                <th *ngFor="let column of frozenHeaders; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    (click)="handleHeaderClick(column)"
                    class="p-3 text-sm font-semibold text-left text-slate-400 tracking-wider uppercase whitespace-nowrap border-r border-white/5">
                  {{ getHeaderLabel(column) }}
                  <span *ngIf="isSortedColumn(column)" class="stats-sort-indicator">
                    {{ sortIndicator(column) }}
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <!-- Quadrant 2: Scrollable Header -->
        <div class="z-20 overflow-x-hidden overflow-y-scroll bg-[#13172c]/80 backdrop-blur-md border-b border-white/5">
          <table class="table-fixed border-collapse">
            <thead>
              <tr>
                <th *ngFor="let column of scrollHeaders; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    (click)="handleHeaderClick(column)"
                    class="p-3 text-sm font-semibold text-left text-slate-400 tracking-wider uppercase whitespace-nowrap border-r border-white/5">
                  {{ getHeaderLabel(column) }}
                  <span *ngIf="isSortedColumn(column)" class="stats-sort-indicator">
                    {{ sortIndicator(column) }}
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <!-- Quadrant 3: Frozen Columns -->
        <div class="z-20 overflow-y-hidden overflow-x-scroll bg-[#0D1120]/60 backdrop-blur-md border-r border-white/5">
          <table class="table-fixed border-collapse">
            <tbody>
              <tr *ngFor="let row of frozenRows; trackBy: trackByRow" class="hover:bg-slate-700/40 transition-colors duration-200">
                <td *ngFor="let column of row.visibleColumns; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    class="p-3 text-sm whitespace-nowrap border-b border-white/5 text-center text-slate-300">
                  <ng-container [ngSwitch]="column">
                    <span *ngSwitchCase="'RK'" class="stats-rank-cell" [style.color]="row.meta?.rkColor || ''">
                      {{ getCellValue(row, column) }}
                    </span>
                    <button *ngSwitchCase="'PLAYER'"
                            type="button"
                            class="stats-player-btn"
                            (click)="handlePlayerClick(row.entryIndex)"
                            [title]="row.meta?.fullName || getCellValue(row, column)">
                      {{ getCellValue(row, column) }}
                    </button>
                    <span *ngSwitchCase="'POS'" class="player-tag modal-pos-tag" [class]="row.meta?.pos || ''">
                      {{ row.meta?.pos || getCellValue(row, column) }}
                    </span>
                    <span *ngSwitchDefault>
                      {{ getCellValue(row, column) }}
                    </span>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Quadrant 4: Master Scroll Container -->
        <div class="z-10 overflow-x-auto overflow-y-scroll bg-[#0D1120]/60 backdrop-blur-md"
             (scroll)="onMasterScroll($event)">
          <table class="table-fixed border-collapse">
            <tbody>
              <tr *ngFor="let row of scrollRows; trackBy: trackByRow" class="hover:bg-slate-700/40 transition-colors duration-200">
                <td *ngFor="let column of row.visibleColumns; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    class="p-3 text-sm whitespace-nowrap border-b border-white/5 text-center text-slate-300">
                  <ng-container [ngSwitch]="column">
                    <span *ngSwitchCase="'RK'" class="stats-rank-cell" [style.color]="row.meta?.rkColor || ''">
                      {{ getCellValue(row, column) }}
                    </span>
                    <button *ngSwitchCase="'PLAYER'"
                            type="button"
                            class="stats-player-btn"
                            (click)="handlePlayerClick(row.entryIndex)"
                            [title]="row.meta?.fullName || getCellValue(row, column)">
                      {{ getCellValue(row, column) }}
                    </button>
                    <span *ngSwitchCase="'POS'" class="player-tag modal-pos-tag" [class]="row.meta?.pos || ''">
                      {{ row.meta?.pos || getCellValue(row, column) }}
                    </span>
                    <ng-container *ngSwitchCase="'TM'">
                      <ng-container *ngIf="row.meta?.pos === 'RDP'; else teamCells">
                        <span style="color: var(--color-text-secondary);">RDP</span>
                      </ng-container>
                      <ng-template #teamCells>
                        <ng-container *ngIf="row.meta?.team && row.meta.team !== 'FA'; else faCells">
                          <img class="team-logo glow"
                               [src]="getTeamLogo(row.meta.team)"
                               [alt]="row.meta.team"
                               width="20"
                               height="20"
                               loading="lazy"
                               decoding="async">
                        </ng-container>
                        <ng-template #faCells>
                          <span class="stats-team-chip" [style]="row.meta?.teamStyle || ''">
                            {{ getCellValue(row, column) }}
                          </span>
                        </ng-template>
                      </ng-template>
                    </ng-container>
                    <span *ngSwitchCase="'VALUE'" class="stats-value-chip" [style]="row.meta?.valueStyle || ''">
                      {{ getCellValue(row, column) }}
                    </span>
                    <span *ngSwitchCase="'AGE'" class="stats-age-cell" [style.color]="row.meta?.ageColor || ''">
                      {{ getCellValue(row, column) }}
                    </span>
                    <span *ngSwitchCase="'FPTS'" class="stats-fpts-cell" [style.color]="row.meta?.fptsColor || ''">
                      {{ getCellValue(row, column) }}
                    </span>
                    <span *ngSwitchCase="'PPG'" class="stats-ppg-cell" [style.color]="row.meta?.ppgColor || ''">
                      {{ getCellValue(row, column) }}
                    </span>
                    <span *ngSwitchDefault>
                      {{ getCellValue(row, column) }}
                    </span>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})(class DataTableComponent {
  tableBridge = inject(TableBridgeService);

  get frozenHeaders() {
    return this.tableBridge.frozenHeaders();
  }

  get scrollHeaders() {
    return this.tableBridge.scrollHeaders();
  }

  get frozenRows() {
    return this.tableBridge.frozenRows();
  }

  get scrollRows() {
    return this.tableBridge.scrollRows();
  }

  get sortState() {
    return this.tableBridge.sortState();
  }

  onMasterScroll(event) {
    const target = event?.target;
    if (!target) return;
    const grid = target.parentElement;
    if (!grid || grid.children.length < 4) return;
    const headerDiv = grid.children[1];
    const frozenDiv = grid.children[2];
    if (headerDiv) headerDiv.scrollLeft = target.scrollLeft;
    if (frozenDiv) frozenDiv.scrollTop = target.scrollTop;
  }

  trackByColumn(_index, column) {
    return column || _index;
  }

  trackByRow(_index, row) {
    return row?.entryIndex ?? _index;
  }

  getColumnWidth(column) {
    return this.tableBridge.getColumnWidth(column);
  }

  getHeaderLabel(column) {
    return this.tableBridge.headerDisplay().get(column) || column;
  }

  getCellValue(row, column) {
    return row.formatted?.[column] ?? row.row?.[column] ?? '';
  }

  isSortedColumn(column) {
    const sort = this.sortState;
    return sort.column === column && sort.direction !== 0;
  }

  sortIndicator(column) {
    const sort = this.sortState;
    if (sort.column !== column) return '';
    if (sort.direction === 1) return '▲';
    if (sort.direction === 2) return '▼';
    return '';
  }

  handleHeaderClick(column) {
    if (typeof window.__dhStatsHandleSort === 'function') {
      window.__dhStatsHandleSort(column);
    }
  }

  handlePlayerClick(entryIndex) {
    if (typeof window.__dhStatsHandlePlayerClick === 'function') {
      window.__dhStatsHandlePlayerClick(entryIndex);
    }
  }

  getTeamLogo(team) {
    const map = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
    const normalized = map[team] || team?.toLowerCase() || 'fa';
    return `../assets/NFL-Tags_webp/${normalized}.webp`;
  }
});
