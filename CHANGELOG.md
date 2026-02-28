# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-03-01

### Added

#### Desktop Environment
- Windows-like desktop with wallpaper, desktop icons, and taskbar
- Floating windows: draggable, resizable, minimize / maximize / close
- Start Menu with multi-level submenu support
- Window title bar with app icon + title
- Windows open maximized when `defaultWidth` or `defaultHeight` is `0`

#### Authentication
- Login page with `guestGuard` (redirect if already logged in)
- `authGuard` protecting the desktop route
- Hash location strategy for Electron compatibility

#### Profile
- Modern profile page with hero section, gradient banner, avatar initials fallback
- Editable fields: name, role, email, phone, location, bio
- Signal-based draft/save/cancel edit flow

#### User Management
- User list window (`/users`)

#### About Window
- Application info page

#### Shared UI Components

**`MyAlert`** (`src/app/shares/my-alert/`)
- Promise-based modal dialogs: `success`, `info`, `warning`, `error`, `confirm`, `input`
- Built on `MatDialog` with type-based accent colours and icons

**`MyToastr`** (`src/app/shares/my-toastr/`)
- Signal-based toast notification service
- Auto-dismiss timer (`default: 4 s`), configurable duration (`0` = persistent)
- Progress bar, slide-in/out animation, dismiss by ID, clear all
- Types: `success`, `info`, `warning`, `error`

**`MyTabs`** (`src/app/shares/my-tabs/`)
- Reusable tab component with `line` (underline) and `pill` (segmented) variants
- `initialIndex` input, `tabChange` output, `disabled` per-tab support
- Material icon support per tab
- `MyTabsModule` export constant for easy import

#### Example / Showcase Windows
- **My UI Example** — interactive demo of MyAlert, MyToastr, MyTabs with code snippets
- **Tailwind Example** — Tailwind CSS v4 showcase: Typography, Colours, Buttons, Badges, Alerts, Cards, Forms, Table, Progress, Avatars
- **Angular Material Example** — Angular Material v21 showcase across 4 tabs: Buttons & Chips, Forms, Cards & Table, Panels

#### Tooling & Infrastructure
- Angular 21 standalone components, signals, `ChangeDetectionStrategy.OnPush`
- Electron desktop shell with `electron/main.js`
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Angular Material v21 with Azure/Blue theme and `provideAnimations()`
- `npm run build:macos` for macOS Electron packaging

---

## [Unreleased]

_Nothing yet._
