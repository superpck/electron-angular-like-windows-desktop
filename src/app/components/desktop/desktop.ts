import { ChangeDetectionStrategy, Component, DestroyRef, Type, effect, inject, signal } from '@angular/core';
import { NgComponentOutlet, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Settings } from '../settings/settings';
import { DesktopSettingsService } from '../../services/desktop-settings.service';
import { LoginService } from '../../services/login.service';
import { WindowManagerService } from '../../services/window-manager.service';
import { DESKTOP_ICONS, START_MENU_ITEMS, AppItem } from '../../configs/desktop-menu';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: Type<unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  prevX: number;
  prevY: number;
  prevWidth: number;
  prevHeight: number;
  zIndex: number;
}

interface DragState {
  windowId: string;
  startMouseX: number;
  startMouseY: number;
  startWinX: number;
  startWinY: number;
}

interface ResizeState {
  windowId: string;
  startMouseX: number;
  startMouseY: number;
  startWidth: number;
  startHeight: number;
}

@Component({
  selector: 'app-desktop',
  imports: [NgComponentOutlet],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Desktop {
  private destroyRef = inject(DestroyRef);
  private doc = inject(DOCUMENT);
  private settingsService = inject(DesktopSettingsService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private windowManagerService = inject(WindowManagerService);

  readonly currentUser = this.loginService.currentUser;

  readonly backgroundColor = this.settingsService.backgroundColor;
  readonly textColor = this.settingsService.textColor;
  readonly textShadow = this.settingsService.textShadow;
  readonly iconShadow = this.settingsService.iconShadow;
  readonly windowBgColor = this.settingsService.windowBgColor;
  readonly windowTextColor = this.settingsService.windowTextColor;
  readonly taskbarBgColor = this.settingsService.taskbarBgColor;
  readonly taskbarTextColor = this.settingsService.taskbarTextColor;
  readonly startBtnBgColor = this.settingsService.startBtnBgColor;
  readonly startBtnTextColor = this.settingsService.startBtnTextColor;

  desktopIcon = signal<AppItem[]>(DESKTOP_ICONS);

  startMenu = signal<AppItem[]>(START_MENU_ITEMS);

  activeSubmenu = signal<AppItem | null>(null);

  toggleSubmenu(item: AppItem): void {
    this.activeSubmenu.update((cur) => (cur?.id === item.id ? null : item));
  }

  selectMenuItem(item: AppItem): void {
    if (item.children?.length) {
      this.toggleSubmenu(item);
    } else {
      this.activeSubmenu.set(null);
      this.openWindow(item);
    }
  }

  readonly settingsItem: AppItem = { id: 'settings', label: 'Desktop Settings', icon: 'assets/images/logo1.png', component: Settings, defaultWidth: 450, defaultHeight: 700 };

  openSettings() {
    this.openWindow(this.settingsItem);
  }

  windows = signal<WindowState[]>([]);
  startMenuOpen = signal(false);
  currentTime = signal('');
  contextMenu = signal<{ id: string; x: number; y: number } | null>(null);

  private dragState: DragState | null = null;
  private resizeState: ResizeState | null = null;

  constructor() {
    this.updateTime();
    const timer = setInterval(() => this.updateTime(), 1000);

    effect(() => {
      const item = this.windowManagerService.openRequest();
      if (item) {
        this.openWindow(item);
        this.windowManagerService.clearRequest();
      }
    });

    effect(() => {
      const id = this.windowManagerService.closeRequest();
      if (id) {
        this.closeWindow(id);
        this.windowManagerService.clearCloseRequest();
      }
    });

    const onMouseMove = (e: MouseEvent) => this.onDocMouseMove(e);
    const onMouseUp = () => this.onDocMouseUp();
    this.doc.addEventListener('mousemove', onMouseMove);
    this.doc.addEventListener('mouseup', onMouseUp);

    this.destroyRef.onDestroy(() => {
      clearInterval(timer);
      this.doc.removeEventListener('mousemove', onMouseMove);
      this.doc.removeEventListener('mouseup', onMouseUp);
    });
  }

  private updateTime() {
    const now = new Date();
    this.currentTime.set(this.settingsService.formatTime(now));
  }

  openWindow(item: AppItem) {
    if (!item.component) return;
    const component = item.component;
    const existing = this.windows().find((w) => w.id === item.id);
    if (existing) {
      this.windows.update((wins) => wins.map((w) => (w.id === item.id ? { ...w, minimized: false } : w)));
      this.bringToFront(item.id);
      this.startMenuOpen.set(false);
      return;
    }
    const count = this.windows().length;
    const maxZ = this.windows().reduce((max, w) => Math.max(max, w.zIndex), 0);
    const x = 80 + count * 30;
    const y = 60 + count * 30;
    const width = item.defaultWidth || 800;
    const height = item.defaultHeight || 500;
    const maximize = !item.defaultWidth || !item.defaultHeight;
    this.windows.update((wins) => [
      ...wins,
      {
        id: item.id,
        title: item.label,
        icon: item.icon,
        component,
        x,
        y,
        width,
        height,
        minimized: false,
        maximized: maximize,
        prevX: x,
        prevY: y,
        prevWidth: width,
        prevHeight: height,
        zIndex: maxZ + 1,
      },
    ]);
    this.startMenuOpen.set(false);
  }

  closeWindow(id: string) {
    this.windows.update((wins) => wins.filter((w) => w.id !== id));
    this.windowManagerService.notifyWindowClosed(id);
  }

  minimizeWindow(id: string) {
    this.windows.update((wins) => wins.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }

  toggleMinimize(id: string) {
    const win = this.windows().find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) {
      this.windows.update((wins) => wins.map((w) => (w.id === id ? { ...w, minimized: false } : w)));
      this.bringToFront(id);
    } else {
      this.minimizeWindow(id);
    }
  }

  toggleMaximize(id: string) {
    this.windows.update((wins) =>
      wins.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return { ...w, maximized: false, x: w.prevX, y: w.prevY, width: w.prevWidth, height: w.prevHeight };
        } else {
          return { ...w, maximized: true, prevX: w.x, prevY: w.y, prevWidth: w.width, prevHeight: w.height };
        }
      }),
    );
  }

  bringToFront(id: string) {
    const maxZ = this.windows().reduce((max, w) => Math.max(max, w.zIndex), 0);
    const current = this.windows().find((w) => w.id === id);
    if (!current || current.zIndex === maxZ) return;
    this.windows.update((wins) => wins.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w)));
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  toggleStartMenu() {
    this.startMenuOpen.update((v) => !v);
  }

  closeStartMenu() {
    this.startMenuOpen.set(false);
    this.activeSubmenu.set(null);
  }

  startDrag(event: MouseEvent, id: string) {
    event.preventDefault();
    const win = this.windows().find((w) => w.id === id);
    if (!win || win.maximized) return;
    this.dragState = {
      windowId: id,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startWinX: win.x,
      startWinY: win.y,
    };
    this.bringToFront(id);
  }

  startResize(event: MouseEvent, id: string) {
    event.preventDefault();
    event.stopPropagation();
    const win = this.windows().find((w) => w.id === id);
    if (!win || win.maximized) return;
    this.resizeState = {
      windowId: id,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startWidth: win.width,
      startHeight: win.height,
    };
  }

  private onDocMouseMove(event: MouseEvent) {
    if (this.dragState) {
      const dx = event.clientX - this.dragState.startMouseX;
      const dy = event.clientY - this.dragState.startMouseY;
      const id = this.dragState.windowId;
      const win = this.windows().find((w) => w.id === id);
      if (win) {
        const TITLEBAR_H = 36;
        const TASKBAR_H = 48;
        const viewW = this.doc.documentElement.clientWidth;
        const viewH = this.doc.documentElement.clientHeight;
        const rawX = this.dragState.startWinX + dx;
        const rawY = this.dragState.startWinY + dy;
        // Keep at least 120 px of title bar visible horizontally
        const newX = Math.max(-(win.width - 120), Math.min(rawX, viewW - 120));
        // Title bar must stay within desktop (not behind taskbar, not above top)
        const newY = Math.max(0, Math.min(rawY, viewH - TASKBAR_H - TITLEBAR_H));
        this.windows.update((wins) => wins.map((w) => (w.id === id ? { ...w, x: newX, y: newY } : w)));
      }
    }
    if (this.resizeState) {
      const dx = event.clientX - this.resizeState.startMouseX;
      const dy = event.clientY - this.resizeState.startMouseY;
      const id = this.resizeState.windowId;
      const newW = Math.max(300, this.resizeState.startWidth + dx);
      const newH = Math.max(200, this.resizeState.startHeight + dy);
      this.windows.update((wins) => wins.map((w) => (w.id === id ? { ...w, width: newW, height: newH } : w)));
    }
  }

  private onDocMouseUp() {
    this.dragState = null;
    this.resizeState = null;
  }

  openTaskbarContextMenu(event: MouseEvent, id: string) {
    event.preventDefault();
    this.contextMenu.set({ id, x: event.clientX, y: event.clientY });
  }

  closeContextMenu() {
    this.contextMenu.set(null);
  }
}
