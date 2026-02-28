import { About } from '../components/about/about';
import { Profile } from '../components/profile/profile';
import { User } from '../components/user/user';
import { MyUiExample } from '../components/my-ui-example/my-ui-example';
import { TailwindExample } from '../components/tailwind-example/tailwind-example';
import { MaterialExample } from '../components/material-example/material-example';
import { Type } from '@angular/core';

// ─────────────────────────────────────────────────────────────────────────────
// AppItem interface
// ─────────────────────────────────────────────────────────────────────────────
export interface AppItem {
  /** Unique identifier — must be unique across all items */
  id: string;
  /** Label shown on the icon / menu entry */
  label: string;
  /** Path to the icon image, e.g. 'assets/images/myapp.png' */
  icon: string;
  /** Angular standalone component to render inside the floating window */
  component?: Type<unknown>;
  /** Initial window width in px.  Set to 0 to open maximized. */
  defaultWidth?: number;
  /** Initial window height in px.  Set to 0 to open maximized. */
  defaultHeight?: number;
  /** Child items — omit `component` on the parent to render as a submenu group */
  children?: AppItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP_ICONS
// Icons rendered on the desktop wallpaper (double-click to open).
//
// HOW TO ADD A NEW DESKTOP ICON:
//   1. Create your component:  ng g c components/my-app
//   2. Import it below
//   3. Add an AppItem entry to the array
//
// Example:
//   import { MyApp } from '../components/my-app/my-app';
//   {
//     id: 'my-app',               // unique id
//     label: 'My App',            // shown under the icon
//     icon: 'assets/images/my-app.png',
//     component: MyApp,
//     defaultWidth: 800,          // initial window size
//     defaultHeight: 600,         // use 0 on either to open maximized
//   },
// ─────────────────────────────────────────────────────────────────────────────
export const DESKTOP_ICONS: AppItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'assets/images/profile1.png',
    component: Profile,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  {
    id: 'user',
    label: 'Users',
    icon: 'assets/images/user1.png',
    component: User,
    defaultWidth: 0,  // 0 = open maximized
    defaultHeight: 0,
  },
  // ↓ ADD NEW DESKTOP ICONS HERE ↓
];

// ─────────────────────────────────────────────────────────────────────────────
// START_MENU_ITEMS
// Items listed in the Start Menu (bottom-left taskbar button).
//
// HOW TO ADD A NEW START MENU ITEM (flat):
//   1. Import your component above
//   2. Add an AppItem entry to the array
//
// Example:
//   import { MyApp } from '../components/my-app/my-app';
//   {
//     id: 'my-app',
//     label: 'My App',
//     icon: 'assets/images/my-app.png',
//     component: MyApp,
//     defaultWidth: 800,
//     defaultHeight: 600,
//   },
//
// HOW TO ADD A SUBMENU GROUP:
//   Omit `component` on the parent and provide a `children` array.
//   Each child follows the same AppItem shape.
//
// Example:
//   {
//     id: 'tools-group',
//     label: 'Tools',
//     icon: 'assets/images/tools.png',
//     children: [
//       { id: 'tool-a', label: 'Tool A', icon: '...', component: ToolA, defaultWidth: 600, defaultHeight: 400 },
//       { id: 'tool-b', label: 'Tool B', icon: '...', component: ToolB, defaultWidth: 600, defaultHeight: 400 },
//     ],
//   },
// ─────────────────────────────────────────────────────────────────────────────
export const START_MENU_ITEMS: AppItem[] = [
  {
    id: 'about',
    label: 'About',
    icon: 'assets/images/about2.png',
    component: About,
    defaultWidth: 800,
    defaultHeight: 500,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'assets/images/profile1.png',
    component: Profile,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  {
    id: 'user',
    label: 'Users',
    icon: 'assets/images/user1.png',
    component: User,
    defaultWidth: 0,  // 0 = open maximized
    defaultHeight: 0,
  },
  // ── Submenu group example ─────────────────────────────────────────────────
  {
    id: 'ui-example-group',
    label: 'UI Example',
    icon: 'assets/images/logo1.png',
    // No `component` → renders as a collapsible submenu group
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
      // ↓ ADD NEW SUBMENU CHILDREN HERE ↓
    ],
  },
  // ↓ ADD NEW START MENU ITEMS HERE ↓
];
