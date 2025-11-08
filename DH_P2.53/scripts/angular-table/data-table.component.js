import {
  Component,
  ChangeDetectionStrategy,
  inject,
  viewChild,
  ElementRef,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBridgeService } from './table-bridge.service.js';

export const DataTableComponent = Component({
  standalone: true,
  selector: 'app-data-table',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-liquid-shell">
      <div class="stats-liquid-grid">
        <div class="stats-liquid-quad stats-liquid-corner">
          <table class="stats-table stats-table-corner table-fixed border-collapse">
            <thead>
              <tr>
                <th
                  *ngFor="let column of frozenColumnsValue; trackBy: trackByColumn"
                  [style.width]="getColumnWidth(column)"
                  [style.min-width]="getColumnWidth(column)"
                  (click)="handleHeaderClick(column)"
                  class="p-3 text-sm font-semibold text-left text-slate-400 tracking-wider uppercase whitespace-nowrap border-r border-white/5 stats-header-all"
                >
                  <span>{{ getHeaderLabel(column) }}</span>
                  <span *ngIf="isSortedColumn(column)" class="stats-sort-indicator">
                    {{ sortIndicator() }}
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="stats-liquid-quad stats-liquid-header">
          <div class="stats-liquid-scroll stats-liquid-scroll-header" #scrollableHeader>
            <table class="stats-table stats-table-header table-fixed border-collapse">
              <thead>
                <tr>
                  <th
                    *ngFor="let column of scrollColumnsValue; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    (click)="handleHeaderClick(column)"
                    class="p-3 text-sm font-semibold text-left text-slate-400 tracking-wider uppercase whitespace-nowrap border-r border-white/5 stats-header-all"
                  >
                    <span>{{ getHeaderLabel(column) }}</span>
                    <span *ngIf="isSortedColumn(column)" class="stats-sort-indicator">
                      {{ sortIndicator() }}
                    </span>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div class="stats-liquid-quad stats-liquid-frozen">
          <div class="stats-liquid-scroll stats-liquid-scroll-frozen" #frozenColumns>
            <table class="stats-table stats-table-frozen table-fixed border-collapse">
              <tbody>
                <tr *ngFor="let row of frozenRowsValue; trackBy: trackByRow" class="hover:bg-slate-700/40 transition-colors duration-200">
                  <td
                    *ngFor="let column of row.visibleColumns; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    class="p-3 text-sm whitespace-nowrap border-b border-white/5 text-center text-slate-300"
                  >
                    <ng-container [ngSwitch]="column">
                      <span *ngSwitchCase="'RK'" class="stats-rank-cell" [style.color]="row.meta?.rkColor || ''">
                        {{ getCellValue(row, column) }}
                      </span>
                      <button
                        *ngSwitchCase="'PLAYER'"
                        type="button"
                        class="stats-player-btn"
                        (click)="handlePlayerClick(row.entryIndex)"
                        [title]="row.meta?.fullName || getCellValue(row, column)"
                      >
                        {{ getCellValue(row, column) }}
                      </button>
                      <span *ngSwitchCase="'VALUE'" class="stats-value-chip" [style]="row.meta?.valueStyle || ''">
                        {{ getCellValue(row, column) }}
                      </span>
                      <span *ngSwitchCase="'POS'" class="player-tag modal-pos-tag" [class]="row.meta?.pos || ''">
                        {{ row.meta?.pos || getCellValue(row, column) }}
                      </span>
                      <ng-container *ngSwitchCase="'TM'">
                        <ng-container *ngIf="row.meta?.pos === 'RDP'; else frozenTeam">
                          <span style="color: var(--color-text-secondary);">RDP</span>
                        </ng-container>
                        <ng-template #frozenTeam>
                          <ng-container *ngIf="row.meta?.team && row.meta.team !== 'FA'; else frozenFa">
                            <img
                              class="team-logo glow"
                              [src]="getTeamLogo(row.meta.team)"
                              [alt]="row.meta.team"
                              width="20"
                              height="20"
                              loading="lazy"
                              decoding="async"
                            />
                          </ng-container>
                          <ng-template #frozenFa>
                            <span class="stats-team-chip" [style]="row.meta?.teamStyle || ''">
                              {{ getCellValue(row, column) }}
                            </span>
                          </ng-template>
                        </ng-template>
                      </ng-container>
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
        <div class="stats-liquid-quad stats-liquid-body">
          <div class="stats-liquid-scroll stats-liquid-scroll-body" (scroll)="handleBodyScroll($event)" #bodyScroll>
            <table class="stats-table stats-table-main table-fixed border-collapse">
              <tbody>
                <tr *ngFor="let row of scrollRowsValue; trackBy: trackByRow" class="hover:bg-slate-700/40 transition-colors duration-200">
                  <td
                    *ngFor="let column of row.visibleColumns; trackBy: trackByColumn"
                    [style.width]="getColumnWidth(column)"
                    [style.min-width]="getColumnWidth(column)"
                    class="p-3 text-sm whitespace-nowrap border-b border-white/5 text-center text-slate-300"
                  >
                    <ng-container [ngSwitch]="column">
                      <span *ngSwitchCase="'RK'" class="stats-rank-cell" [style.color]="row.meta?.rkColor || ''">
                        {{ getCellValue(row, column) }}
                      </span>
                      <button
                        *ngSwitchCase="'PLAYER'"
                        type="button"
                        class="stats-player-btn"
                        (click)="handlePlayerClick(row.entryIndex)"
                        [title]="row.meta?.fullName || getCellValue(row, column)"
                      >
                        {{ getCellValue(row, column) }}
                      </button>
                      <span *ngSwitchCase="'VALUE'" class="stats-value-chip" [style]="row.meta?.valueStyle || ''">
                        {{ getCellValue(row, column) }}
                      </span>
                      <span *ngSwitchCase="'POS'" class="player-tag modal-pos-tag" [class]="row.meta?.pos || ''">
                        {{ row.meta?.pos || getCellValue(row, column) }}
                      </span>
                      <ng-container *ngSwitchCase="'TM'">
                        <ng-container *ngIf="row.meta?.pos === 'RDP'; else bodyTeam">
                          <span style="color: var(--color-text-secondary);">RDP</span>
                        </ng-container>
                        <ng-template #bodyTeam>
                          <ng-container *ngIf="row.meta?.team && row.meta.team !== 'FA'; else bodyFa">
                            <img
                              class="team-logo glow"
                              [src]="getTeamLogo(row.meta.team)"
                              [alt]="row.meta.team"
                              width="20"
                              height="20"
                              loading="lazy"
                              decoding="async"
                            />
                          </ng-container>
                          <ng-template #bodyFa>
                            <span class="stats-team-chip" [style]="row.meta?.teamStyle || ''">
                              {{ getCellValue(row, column) }}
                            </span>
                          </ng-template>
                        </ng-template>
                      </ng-container>
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
    </div>
  `
})(class DataTableComponent {
  tableBridge = inject(TableBridgeService);
  scrollableHeader = viewChild('scrollableHeader', { read: ElementRef });
  frozenColumnsEl = viewChild('frozenColumns', { read: ElementRef });
  bodyScroll = viewChild('bodyScroll', { read: ElementRef });

  constructor() {
    effect(() => {
      this.tableBridge.rows();
      queueMicrotask(() => this.resetScroll());
    });
  }

  resetScroll() {
    const bodyEl = this.bodyScroll()?.nativeElement;
    if (bodyEl) {
      this.handleBodyScroll(bodyEl);
    }
  }

  get frozenColumnsValue() {
    return this.tableBridge.frozenHeaders();
  }

  get scrollColumnsValue() {
    return this.tableBridge.scrollHeaders();
  }

  get frozenRowsValue() {
    return this.tableBridge.frozenRows();
  }

  get scrollRowsValue() {
    return this.tableBridge.scrollRows();
  }

  get sortStateValue() {
    return this.tableBridge.sortState();
  }

  get headerDisplayValue() {
    return this.tableBridge.headerDisplay();
  }

  trackByColumn(index, column) {
    return column || index;
  }

  trackByRow(index, row) {
    return row?.entryIndex ?? index;
  }

  handleBodyScroll(event) {
    const target = event?.target || event;
    if (!target) return;
    const headerRef = this.scrollableHeader()?.nativeElement;
    const frozenRef = this.frozenColumnsEl()?.nativeElement;
    if (headerRef) headerRef.scrollLeft = target.scrollLeft;
    if (frozenRef) frozenRef.scrollTop = target.scrollTop;
  }

  getHeaderLabel(column) {
    return this.headerDisplayValue.get(column) || column;
  }

  getColumnWidth(column) {
    return this.tableBridge.getColumnWidth(column);
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

  isSortedColumn(column) {
    const sort = this.sortStateValue;
    return sort.column === column && sort.direction !== 0;
  }

  sortIndicator() {
    const sort = this.sortStateValue;
    if (sort.direction === 1) return '▲';
    if (sort.direction === 2) return '▼';
    return '';
  }

  getCellValue(row, column) {
    return row.formatted?.[column] ?? row.row?.[column] ?? '';
  }

  getTeamLogo(team) {
    const map = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
    const normalized = map[team] || team?.toLowerCase() || 'fa';
    return `../assets/NFL-Tags_webp/${normalized}.webp`;
  }
});
