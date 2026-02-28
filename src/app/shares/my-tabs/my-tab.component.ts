import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-my-tab',
  template: `
    <div class="my-tab-pane" [class.my-tab-pane--active]="active()">
      <ng-content />
    </div>
  `,
  styles: [`
    .my-tab-pane {
      display: none;
      height: 100%;
      &.my-tab-pane--active { display: block; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTabComponent {
  /** Tab header label */
  title = input.required<string>();
  /** Optional Material icon name shown beside the title */
  icon = input<string>();
  /** Disabled state */
  disabled = input(false);

  /** Controlled by the parent MyTabsComponent */
  readonly active = signal(false);
}
