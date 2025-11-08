import { Injectable, signal, computed } from '@angular/core';

const COLUMN_WIDTHS = {
  'RK': 64,
  'PLAYER': 192,
  'POS': 90,
  'TM': 80,
  'AGE': 80,
  'G': 72,
  'FPTS': 104,
  'PPG': 104,
  'VALUE': 120,
  'YDS(t)': 120,
  'YPG(t)': 120,
  'OPP': 96,
  'IMP': 110,
  'IMP/G': 110,
  'IMP/OPP': 128,
  'CSTY%': 120,
  'CL': 96,
  'paRTG': 120,
  'paYDS': 128,
  'paTD': 104,
  'CMP%': 112,
  'paATT': 104,
  'CMP': 104,
  'pa1D': 104,
  'paYPG': 120,
  'ruYDS': 120,
  'ruTD': 104,
  'ruYPG': 120,
  'CAR': 96,
  'YPC': 104,
  'TTT': 118,
  'PRS%': 112,
  'SAC': 96,
  'INT': 96,
  'FUM': 96,
  'FPOE': 112,
  'SNP%': 118,
  'REC': 96,
  'recYDS': 120,
  'TGT': 96,
  'ELU': 110,
  'MTF/A': 128,
  'YCO/A': 128,
  'MTF': 104,
  'YCO': 120,
  'ru1D': 104,
  'recTD': 104,
  'rec1D': 104,
  'YAC': 118,
  'TS%': 110,
  'YPRR': 128,
  '1DRR': 128,
  'recYPG': 120,
  'RR': 110,
  'YPR': 104,
  'pIMP': 118,
  'pIMP/A': 130
};

export const TableBridgeService = Injectable({ providedIn: 'root' })(class TableBridgeService {
  constructor() {
    this.columns = signal([]);
    this.headers = signal([]);
    this.rows = signal([]);
    this.sortState = signal({ column: null, direction: 0 });
  }

  frozenHeaders = computed(() => this.columns().slice(0, 3));
  scrollHeaders = computed(() => this.columns().slice(3));
  headerDisplay = computed(() => {
    return new Map(this.headers().map((header) => [header.key, header.label]));
  });

  frozenRows = computed(() => {
    const frozenColumns = this.frozenHeaders();
    return this.rows().map((row) => ({
      ...row,
      visibleColumns: frozenColumns
    }));
  });

  scrollRows = computed(() => {
    const scrollColumns = this.scrollHeaders();
    return this.rows().map((row) => ({
      ...row,
      visibleColumns: scrollColumns
    }));
  });

  setDataset(payload = {}) {
    const {
      columns = [],
      headers = [],
      rows = [],
      sortState = { column: null, direction: 0 }
    } = payload;
    this.columns.set(Array.isArray(columns) ? columns : []);
    this.headers.set(Array.isArray(headers) ? headers : []);
    this.rows.set(Array.isArray(rows) ? rows : []);
    this.sortState.set(sortState);
  }

  getColumnWidth(column) {
    return `${COLUMN_WIDTHS[column] || 96}px`;
  }
});
