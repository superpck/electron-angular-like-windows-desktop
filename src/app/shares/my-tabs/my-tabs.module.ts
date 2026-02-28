/**
 * MyTabsModule
 *
 * Standalone "module" – spread into your component's imports array:
 *
 *   @Component({
 *     imports: [...MyTabsModule],
 *     ...
 *   })
 *
 * Template usage:
 *
 *   <app-my-tabs [variant]="'line'" (tabChange)="onTab($event)">
 *     <app-my-tab title="General" icon="settings">...</app-my-tab>
 *     <app-my-tab title="Users"   icon="people">...</app-my-tab>
 *     <app-my-tab title="Logs"    icon="list" [disabled]="true">...</app-my-tab>
 *   </app-my-tabs>
 */
export { MyTabsComponent } from './my-tabs.component';
export { MyTabComponent } from './my-tab.component';

import { MyTabsComponent } from './my-tabs.component';
import { MyTabComponent } from './my-tab.component';

export const MyTabsModule = [MyTabsComponent, MyTabComponent] as const;
