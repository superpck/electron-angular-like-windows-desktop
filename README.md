# Electron Angular — Windows-like Desktop

A desktop environment built with **Angular 21** + **Electron**, styled after a Windows-like UI with floating draggable windows, a taskbar, a Start Menu with submenus, and a suite of reusable UI components.

[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.io)
[![Electron](https://img.shields.io/badge/Electron-latest-47848F?logo=electron)](https://electronjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Angular Material](https://img.shields.io/badge/Angular_Material-21-757de8?logo=angular)](https://material.angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥 Desktop environment | Wallpaper, desktop icons, taskbar |
| 🪟 Floating windows | Draggable, resizable, minimize / maximize / close |
| 📋 Start Menu | Multi-level submenu support |
| 🔔 `MyAlert` | Promise-based modal dialogs (success, info, warning, error, confirm, input) |
| 🍞 `MyToastr` | Signal-based toast notifications with auto-dismiss & progress bar |
| 🗂 `MyTabs` | Reusable tab component with `line` and `pill` variants |
| 🎨 Tailwind showcase | Live demo of Tailwind CSS v4 utilities |
| 🧱 Material showcase | Live demo of Angular Material v21 components |
| 👤 Profile | Modern profile page with editable fields |
| 👥 User management | User list window |
| 🔑 Auth | Login page with route guards |

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── configs/            # Desktop menu & app items config
│   ├── components/
│   │   ├── desktop/        # Desktop, taskbar, window manager
│   │   ├── profile/        # User profile
│   │   ├── user/           # User management
│   │   ├── about/          # About window
│   │   ├── my-ui-example/  # my-alert / my-toastr / my-tabs demo
│   │   ├── tailwind-example/
│   │   └── material-example/
│   └── shares/
│       ├── my-alert/       # Reusable alert/confirm/input dialog
│       ├── my-toastr/      # Reusable toast notification
│       └── my-tabs/        # Reusable tab component
└── main.ts
electron/
└── main.js                 # Electron entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install dependencies

```bash
npm install
```

### Run in browser (Angular dev server)

```bash
npm start
# or
npx ng serve
```

Open `http://localhost:4404/`

### Run as Electron app

```bash
npm run electron
```

### Build Angular only

```bash
npx ng build
```

### Build & package Electron (macOS)

```bash
npm run build:macos
```

---

## 🧩 Reusable Components

### `MyAlertService`

```typescript
private alert = inject(MyAlertService);

await this.alert.success('Saved!');
await this.alert.error('Failed!');
const ok   = await this.alert.confirm('Delete?');
const name = await this.alert.input('Enter name:');
```

### `MyToastrService`

```typescript
private toastr = inject(MyToastrService);

this.toastr.success('Record saved!');
this.toastr.error('Request failed.');
const id = this.toastr.info('Loading...', { duration: 0 });
this.toastr.dismiss(id);
```

### `MyTabsModule`

```typescript
imports: [...MyTabsModule]
```

```html
<app-my-tabs variant="line" (tabChange)="onTab($event)">
  <app-my-tab title="General" icon="settings">...</app-my-tab>
  <app-my-tab title="Users"   icon="people">...</app-my-tab>
</app-my-tabs>
```

---

## 🖼 Desktop Menu Config

Add windows by editing `src/app/configs/desktop-menu.ts`:

```typescript
{
  id: 'my-app',
  label: 'My App',
  icon: 'assets/images/logo1.png',
  component: MyApp,
  defaultWidth: 800,   // 0 = open maximized
  defaultHeight: 600,
}
```

> Setting `defaultWidth: 0` **or** `defaultHeight: 0` opens the window maximized.

---

## 🛠 Tech Stack

- **Angular 21** — standalone components, signals, `ChangeDetectionStrategy.OnPush`
- **Electron** — cross-platform desktop shell
- **Angular Material 21** — Azure/Blue theme
- **Tailwind CSS 4** — utility-first styling
- **TypeScript 5** — strict mode

---

## 📄 License

[MIT](LICENSE) © 2026 superpck

---

## 🤖 Built with GitHub Copilot

This project was developed with the assistance of **[GitHub Copilot](https://github.com/features/copilot)** — an AI-powered coding assistant by GitHub & OpenAI.


To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4404/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
