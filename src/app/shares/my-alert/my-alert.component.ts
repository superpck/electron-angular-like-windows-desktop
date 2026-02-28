import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export type AlertType = 'success' | 'info' | 'warning' | 'error' | 'confirm' | 'input';

export interface MyAlertData {
  type: AlertType;
  title?: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ICON_MAP: Record<AlertType, string> = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
  confirm: 'help',
  input: 'edit',
};

const TITLE_MAP: Record<AlertType, string> = {
  success: 'Success',
  info: 'Information',
  warning: 'Warning',
  error: 'Error',
  confirm: 'Confirm',
  input: 'Input',
};

@Component({
  selector: 'app-my-alert',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './my-alert.component.html',
  styleUrl: './my-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAlertComponent {
  readonly dialogRef = inject(MatDialogRef<MyAlertComponent>);
  readonly data: MyAlertData = inject(MAT_DIALOG_DATA);

  inputValue = signal(this.data.defaultValue ?? '');

  get icon(): string {
    return ICON_MAP[this.data.type];
  }

  get title(): string {
    return this.data.title ?? TITLE_MAP[this.data.type];
  }

  get isConfirm(): boolean {
    return this.data.type === 'confirm';
  }

  get isInput(): boolean {
    return this.data.type === 'input';
  }

  get isAlert(): boolean {
    return !this.isConfirm && !this.isInput;
  }

  confirm(): void {
    if (this.isInput) {
      this.dialogRef.close(this.inputValue());
    } else {
      this.dialogRef.close(true);
    }
  }

  cancel(): void {
    this.dialogRef.close(this.isInput ? null : false);
  }
}
