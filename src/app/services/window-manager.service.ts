import { Injectable, signal } from '@angular/core';
import type { AppItem } from '../configs/desktop-menu';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  readonly openRequest = signal<AppItem | null>(null);
  readonly closeRequest = signal<string | null>(null);
  readonly lastClosedWindow = signal<{ id: string; ts: number } | null>(null);

  requestOpen(item: AppItem): void {
    this.openRequest.set(item);
  }

  clearRequest(): void {
    this.openRequest.set(null);
  }

  requestClose(windowId: string): void {
    this.closeRequest.set(windowId);
  }

  clearCloseRequest(): void {
    this.closeRequest.set(null);
  }

  notifyWindowClosed(windowId: string): void {
    this.lastClosedWindow.set({ id: windowId, ts: Date.now() });
  }
}
