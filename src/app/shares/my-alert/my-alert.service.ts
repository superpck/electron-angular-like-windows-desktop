import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MyAlertComponent, AlertType, MyAlertData } from './my-alert.component';

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
