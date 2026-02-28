import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MyAlertComponent, AlertType, MyAlertData } from './my-alert.component';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MyAlertService
 * ─────────────────────────────────────────────────────────────────────────────
 * Promise-based modal dialog service built on top of Angular Material Dialog.
 * All methods return a Promise that resolves when the dialog is closed.
 *
 * SETUP
 * ─────
 * Provided in root — no extra configuration needed.
 * Requires `provideAnimations()` in app.config.ts.
 *
 * USAGE
 * ─────
 * Inject anywhere in a component or service:
 *
 *   private alert = inject(MyAlertService);
 *
 * ── Simple alerts (resolve: void) ────────────────────────────────────────────
 *
 *   await this.alert.success('Saved successfully!');
 *   await this.alert.info('Your session will expire soon.');
 *   await this.alert.warning('Low disk space detected.');
 *   await this.alert.error('Request failed. Please try again.');
 *
 *   // With custom title:
 *   await this.alert.success('Upload complete.', 'Upload');
 *
 * ── Confirm dialog (resolve: boolean) ────────────────────────────────────────
 *
 *   const confirmed = await this.alert.confirm('Delete this record?');
 *   if (confirmed) {
 *     // user clicked OK
 *   }
 *
 *   // With custom options:
 *   const ok = await this.alert.confirm('Are you sure?', {
 *     title:        'Confirm Delete',
 *     confirmLabel: 'Delete',
 *     cancelLabel:  'Keep',
 *   });
 *
 * ── Input dialog (resolve: string | null) ─────────────────────────────────────
 *
 *   const name = await this.alert.input('Enter your name:');
 *   if (name !== null) {
 *     // user submitted a value (may be empty string)
 *   }
 *
 *   // With options:
 *   const value = await this.alert.input('Rename item:', {
 *     title:        'Rename',
 *     placeholder:  'New name...',
 *     defaultValue: currentName,
 *     confirmLabel: 'Rename',
 *     cancelLabel:  'Cancel',
 *   });
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface InputOptions {
  title?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Injectable({ providedIn: 'root' })
export class MyAlertService {
  private dialog = inject(MatDialog);

  private open<T>(data: MyAlertData): Promise<T> {
    const ref = this.dialog.open<MyAlertComponent, MyAlertData, T>(MyAlertComponent, {
      data,
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      panelClass: 'my-alert-panel',
    });
    return firstValueFrom(ref.afterClosed()) as Promise<T>;
  }

  /** Simple alert dialogs — resolves when closed */
  alert(type: AlertType, message: string, title?: string): Promise<void> {
    return this.open<void>({ type, message, title });
  }

  success(message: string, title?: string): Promise<void> {
    return this.alert('success', message, title);
  }

  info(message: string, title?: string): Promise<void> {
    return this.alert('info', message, title);
  }

  warning(message: string, title?: string): Promise<void> {
    return this.alert('warning', message, title);
  }

  error(message: string, title?: string): Promise<void> {
    return this.alert('error', message, title);
  }

  /** Confirm dialog — resolves `true` (OK) or `false` (Cancel) */
  confirm(message: string, options?: ConfirmOptions): Promise<boolean> {
    return this.open<boolean>({
      type: 'confirm',
      message,
      title: options?.title,
      confirmLabel: options?.confirmLabel ?? 'Confirm',
      cancelLabel: options?.cancelLabel ?? 'Cancel',
    });
  }

  /** Input dialog — resolves the string entered or `null` if cancelled */
  input(message: string, options?: InputOptions): Promise<string | null> {
    return this.open<string | null>({
      type: 'input',
      message,
      title: options?.title,
      placeholder: options?.placeholder,
      defaultValue: options?.defaultValue,
      confirmLabel: options?.confirmLabel ?? 'OK',
      cancelLabel: options?.cancelLabel ?? 'Cancel',
    });
  }
}
