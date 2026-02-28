import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MyTabComponent } from './my-tab.component';

export type TabsVariant = 'line' | 'pill';

@Component({
  selector: 'app-my-tabs',
  imports: [MatIconModule, MatRippleModule],
  templateUrl: './my-tabs.component.html',
  styleUrl: './my-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTabsComponent implements AfterContentInit {
  readonly tabs = contentChildren(MyTabComponent);

  /** Visual style: 'line' (default) or 'pill' */
  variant = input<TabsVariant>('line');
  /** Initially active tab index */
  initialIndex = input(0);

  /** Emits the newly selected tab index */
  tabChange = output<number>();

  activeIndex = signal(0);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const active = this.activeIndex();
      tabs.forEach((tab, i) => tab.active.set(i === active));
    });
  }

  ngAfterContentInit(): void {
    const initial = Math.min(this.initialIndex(), this.tabs().length - 1);
    this.activeIndex.set(Math.max(0, initial));
  }

  select(index: number): void {
    if (this.tabs()[index]?.disabled()) return;
    this.activeIndex.set(index);
    this.tabChange.emit(index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
