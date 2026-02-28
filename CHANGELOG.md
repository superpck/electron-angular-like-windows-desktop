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

## [1.1.0] — 2026-03-01

### Added

- **Profile page** — full redesign: gradient hero banner, avatar with initials fallback, stats row (Projects / Commits / Reviews), 2-column info grid with hover animations, inline edit form with draft/save/cancel signal flow
- **GitHub Copilot credit** — dedicated section in About window (Pinterest-style logo, gradient background) and README
- **Acknowledgements section** in README — Tailwind CSS, Angular Material, randomuser.me
- **Docs links** — external `target="_blank"` links to Tailwind CSS Docs and Angular Material Docs added to their respective showcase windows
- **`desktop-menu.ts` how-to comments** — step-by-step instructions for adding Desktop Icons, flat Start Menu items, and submenu groups; inline `// ↓ ADD HERE ↓` markers

### Changed

- **`defaultWidth: 0` / `defaultHeight: 0`** — any window configured with `0` on either dimension now opens already maximized; restores to `800×500` on un-maximize
- **`bg-gradient-to-br` → `bg-linear-to-br`** — updated to Tailwind v4 canonical class name in `tailwind-example.html` (all 3 occurrences)
- **README** — full rewrite: badges, feature table, project structure, quick-start guide, reusable component usage examples, desktop menu config docs, tech stack, license, acknowledgements, GitHub Copilot credit; removed Angular CLI boilerplate

### Fixed

- **Pagination select vertical alignment** — `mat-form-field` "Rows per page" select was misaligned vertically relative to text and icon buttons; fixed via `subscriptSizing="dynamic"`, hidden notch border, removed subscript wrapper space, and `align-items: center` on the field flex container

### Documentation

- **`MyAlertService`** — added JSDoc header with full usage examples: simple alerts, confirm dialog, input dialog, all options
- **`MyToastrService`** — added JSDoc header with full usage examples: basic, custom title, custom duration, persistent toast + dismiss, clear all, low-level `show()`

---

## [Unreleased]

_Nothing yet._
