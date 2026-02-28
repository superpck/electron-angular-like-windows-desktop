import { Injectable, signal } from '@angular/core';

export type ToastrType = 'success' | 'info' | 'warning' | 'error';

export interface ToastrItem {
  id: number;
  type: ToastrType;
  message: string;
  title?: string;
  /** Duration in ms. 0 = persistent until manually dismissed. */
  duration: number;
}

export interface ToastrConfig {
  /** Duration in ms. Default: 4000. Set to 0 for persistent. */
  duration?: number;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class MyToastrService {
  private _toasts = signal<ToastrItem[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private counter = 0;

  show(type: ToastrType, message: string, config?: ToastrConfig): number {
    const id = ++this.counter;
    const duration = config?.duration ?? 4000;
    this._toasts.update((list) => [...list, { id, type, message, title: config?.title, duration }]);
    return id;
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }

  success(message: string, config?: ToastrConfig): number {
    return this.show('success', message, config);
  }

  info(message: string, config?: ToastrConfig): number {
    return this.show('info', message, config);
  }

  warning(message: string, config?: ToastrConfig): number {
    return this.show('warning', message, config);
  }

  error(message: string, config?: ToastrConfig): number {
    return this.show('error', message, config);
  }
}
