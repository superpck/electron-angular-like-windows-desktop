import { Injectable, signal } from '@angular/core';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MyToastrService
 * ─────────────────────────────────────────────────────────────────────────────
 * Signal-based toast notification service.
 * Toasts are rendered by <app-my-toastr> which must be placed once in app.html.
 *
 * SETUP
 * ─────
 * 1. Add <app-my-toastr /> to src/app/app.html  (already done)
 * 2. Import MyToastrComponent in app.ts          (already done)
 * 3. Requires `provideAnimations()` in app.config.ts
 *
 * USAGE
 * ─────
 * Inject anywhere in a component or service:
 *
 *   private toastr = inject(MyToastrService);
 *
 * ── Basic (auto-dismiss after 4 000 ms) ──────────────────────────────────────
 *
 *   this.toastr.success('Record saved!');
 *   this.toastr.info('Update available.');
 *   this.toastr.warning('Low disk space.');
 *   this.toastr.error('Request failed.');
 *
 * ── With custom title ─────────────────────────────────────────────────────────
 *
 *   this.toastr.success('Upload complete.', { title: 'Upload' });
 *
 * ── Custom duration (ms) ──────────────────────────────────────────────────────
 *
 *   this.toastr.info('Processing...', { duration: 8000 });
 *
 * ── Persistent toast (duration: 0) ───────────────────────────────────────────
 *
 *   const id = this.toastr.info('Uploading, please wait…', { duration: 0 });
 *   // later, dismiss it manually:
 *   this.toastr.dismiss(id);
 *
 * ── Clear all visible toasts ──────────────────────────────────────────────────
 *
 *   this.toastr.clear();
 *
 * ── Low-level show() ─────────────────────────────────────────────────────────
 *
 *   const id = this.toastr.show('success', 'Done!', { title: 'OK', duration: 3000 });
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
