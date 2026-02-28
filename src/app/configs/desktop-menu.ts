import { About } from '../components/about/about';
import { Profile } from '../components/profile/profile';
import { User } from '../components/user/user';
import { MyUiExample } from '../components/my-ui-example/my-ui-example';
import { TailwindExample } from '../components/tailwind-example/tailwind-example';
import { MaterialExample } from '../components/material-example/material-example';
import { Type } from '@angular/core';

export interface AppItem {
  id: string;
  label: string;
  icon: string;
  component?: Type<unknown>;
  defaultWidth?: number;
  defaultHeight?: number;
  /** Child items — renders this entry as a submenu group */
  children?: AppItem[];
}

export const DESKTOP_ICONS: AppItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'assets/images/logo2.png',
    component: Profile,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  {
    id: 'user',
    label: 'Users',
    icon: 'assets/images/logo2.png',
    component: User,
    defaultWidth: 0,
    defaultHeight: 0,
  },
];

export const START_MENU_ITEMS: AppItem[] = [
  {
    id: 'about',
    label: 'About',
    icon: 'assets/images/logo1.png',
    component: About,
    defaultWidth: 800,
    defaultHeight: 500,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'assets/images/logo2.png',
    component: Profile,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  {
    id: 'user',
    label: 'Users',
    icon: 'assets/images/logo2.png',
    component: User,
    defaultWidth: 0,
    defaultHeight: 0,
  },
  {
    id: 'ui-example-group',
    label: 'UI Example',
    icon: 'assets/images/logo1.png',
    children: [
      {
        id: 'my-ui-example',
        label: 'My UI Component',
        icon: 'assets/images/logo1.png',
        component: MyUiExample,
        defaultWidth: 700,
        defaultHeight: 540,
      },
      {
        id: 'tailwind-example',
        label: 'Tailwind',
        icon: 'assets/images/tailwind_logo.png',
        component: TailwindExample,
        defaultWidth: 780,
        defaultHeight: 600,
      },
      {
        id: 'material-example',
        label: 'Angular Material',
        icon: 'assets/images/material_logo.png',
        component: MaterialExample,
        defaultWidth: 800,
        defaultHeight: 600,
      },
    ],
  },
];
