import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MyAlertService } from '../../shares/my-alert/my-alert.service';
import { MyToastrService } from '../../shares/my-toastr/my-toastr.service';
import { MyTabsModule } from '../../shares/my-tabs/my-tabs.module';

@Component({
  selector: 'app-my-ui-example',
  imports: [MatButtonModule, MatIconModule, MatDividerModule, ...MyTabsModule],
  templateUrl: './my-ui-example.html',
  styleUrl: './my-ui-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyUiExample {
  private alert = inject(MyAlertService);
  private toastr = inject(MyToastrService);

  // ── Code examples ──────────────────────────────────
  readonly codeAlertBasic = `// inject
private alert = inject(MyAlertService);

// usage
await this.alert.success('Done!');
await this.alert.info('Note: ...');
await this.alert.warning('Check settings.');
await this.alert.error('Failed!');

// custom title
await this.alert.success('Upload complete.', 'Upload');`;

  readonly codeAlertConfirmInput = `// confirm — returns Promise<boolean>
const ok = await this.alert.confirm(
  'Delete this item?',
  { title: 'Delete', confirmLabel: 'Delete', cancelLabel: 'Cancel' }
);
if (ok) { /* proceed */ }

// input — returns Promise<string | null>
const name = await this.alert.input('Enter your name:', {
  placeholder: 'e.g. John Doe',
  defaultValue: '',
  confirmLabel: 'Save',
});
if (name !== null) { /* use name */ }`;

  readonly codeToastrBasic = `// inject
private toastr = inject(MyToastrService);

// basic usage (auto-dismiss after 4 s)
this.toastr.success('Record saved!');
this.toastr.info('Update available.');
this.toastr.warning('Low disk space.');
this.toastr.error('Request failed.');

// custom title
this.toastr.success('Upload done.', { title: 'Upload' });`;

  readonly codeToastrOptions = `// persistent — duration: 0 stays until manually dismissed
const id = this.toastr.info('Processing...', { duration: 0 });
// later:
this.toastr.dismiss(id);

// clear all visible toasts
this.toastr.clear();

// custom duration (ms)
this.toastr.success('Done!', { duration: 8000 });`;

  readonly codeTabsLine = `// component imports
imports: [...MyTabsModule]

// line variant (default)
<app-my-tabs variant="line" (tabChange)="onTab($event)">
  <app-my-tab title="General" icon="settings">...</app-my-tab>
  <app-my-tab title="Users"   icon="people">...</app-my-tab>
  <app-my-tab title="Logs"    icon="list" [disabled]="true">...</app-my-tab>
</app-my-tabs>`;  

  readonly codeTabsPill = `// pill variant — starts on index 1
<app-my-tabs variant="pill" [initialIndex]="1">
  <app-my-tab title="Day">...</app-my-tab>
  <app-my-tab title="Week">...</app-my-tab>
  <app-my-tab title="Month">...</app-my-tab>
</app-my-tabs>

// inputs
// variant        : 'line' | 'pill'   (default: 'line')
// initialIndex   : number            (default: 0)
// [disabled]     : boolean           (default: false)
// icon           : Material icon name

// output
// (tabChange)    : EventEmitter<number>`;

  // ── Alert demos ────────────────────────────────────
  showSuccess()     { this.alert.success('Operation completed successfully!'); }
  showInfo()        { this.alert.info('Here is some useful information for you.'); }
  showWarning()     { this.alert.warning('Please review before proceeding.'); }
  showError()       { this.alert.error('Something went wrong. Please try again.'); }

  async showConfirm() {
    const ok = await this.alert.confirm('Are you sure you want to delete this item?', {
      title: 'Delete Item',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    this.toastr.info(ok ? 'Confirmed ✓' : 'Cancelled ✗', { title: 'Confirm Result' });
  }

  async showInput() {
    const value = await this.alert.input('Enter your display name:', {
      title: 'Update Name',
      placeholder: 'e.g. John Doe',
      defaultValue: '',
      confirmLabel: 'Save',
    });
    if (value !== null) {
      this.toastr.success(`Name set to: "${value}"`, { title: 'Input Result' });
    } else {
      this.toastr.warning('Input cancelled.', { title: 'Input Result' });
    }
  }

  // ── Toastr demos ───────────────────────────────────
  toastSuccess()   { this.toastr.success('Record saved successfully!'); }
  toastInfo()      { this.toastr.info('A new update is available.'); }
  toastWarning()   { this.toastr.warning('Disk space is running low.'); }
  toastError()     { this.toastr.error('Network request failed.'); }
  toastPersistent(){ this.toastr.info('This toast stays until dismissed.', { title: 'Persistent', duration: 0 }); }
  toastClear()     { this.toastr.clear(); }
}
