import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MyToastrService, ToastrItem, ToastrType } from './my-toastr.service';

const ICON_MAP: Record<ToastrType, string> = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
};

const TITLE_MAP: Record<ToastrType, string> = {
  success: 'Success',
  info: 'Information',
  warning: 'Warning',
  error: 'Error',
};

@Component({
  selector: 'app-my-toastr',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './my-toastr.component.html',
  styleUrl: './my-toastr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyToastrComponent implements OnDestroy {
  readonly toastrService = inject(MyToastrService);
  readonly toasts = this.toastrService.toasts;

  /** IDs of toasts currently playing their exit animation */
  readonly leaving = signal<Set<number>>(new Set());

  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private exitTimers = new Map<number, ReturnType<typeof setTimeout>>();

  constructor() {
    // Watch for new toasts and start auto-dismiss timers
    effect(() => {
      for (const item of this.toasts()) {
        if (item.duration > 0 && !this.timers.has(item.id)) {
          const t = setTimeout(() => this.dismiss(item.id), item.duration);
          this.timers.set(item.id, t);
        }
      }
    });
  }

  iconOf(type: ToastrType): string {
    return ICON_MAP[type];
  }

  titleOf(item: ToastrItem): string {
    return item.title ?? TITLE_MAP[item.type];
  }

  isLeaving(id: number): boolean {
    return this.leaving().has(id);
  }

  /** Called once a toast is rendered — starts the auto-dismiss timer */
  startTimer(item: ToastrItem): void {
    if (item.duration <= 0 || this.timers.has(item.id)) return;
    const t = setTimeout(() => this.dismiss(item.id), item.duration);
    this.timers.set(item.id, t);
  }

  dismiss(id: number): void {
    // Prevent double-trigger
    if (this.leaving().has(id)) return;

    // Clear auto-dismiss timer
    const t = this.timers.get(id);
    if (t) { clearTimeout(t); this.timers.delete(id); }

    // Mark as leaving (triggers CSS exit animation)
    this.leaving.update((s) => {
      const next = new Set(s);
      next.add(id);
      return next;
    });

    // Remove from store after animation completes (300 ms)
    const exit = setTimeout(() => {
      this.toastrService.dismiss(id);
      this.leaving.update((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      this.exitTimers.delete(id);
    }, 300);
    this.exitTimers.set(id, exit);
  }

  trackById(_: number, item: ToastrItem): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    this.exitTimers.forEach(clearTimeout);
  }
}
