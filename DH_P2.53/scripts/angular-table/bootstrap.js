import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app.component.js';
import { TableBridgeService } from './table-bridge.service.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initAngularTable());
} else {
  initAngularTable();
}

function initAngularTable() {
  const hostElement = document.querySelector('app-stats-table');
  if (!hostElement) return;
  bootstrapApplication(AppComponent, {
    providers: [provideZonelessChangeDetection()]
  }).then((ref) => {
    const bridge = ref.injector.get(TableBridgeService);
    window.__dhStatsTableBridge = {
      setDataset: (payload) => bridge.setDataset(payload || {})
    };
    if (window.__dhStatsPendingDataset) {
      bridge.setDataset(window.__dhStatsPendingDataset);
      window.__dhStatsPendingDataset = null;
    }
  }).catch((err) => console.error('Failed to bootstrap Angular stats table', err));
}
