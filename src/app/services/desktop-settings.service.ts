import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ClockFormat = '12h' | '24h';

export interface DesktopSettings {
  backgroundColor: string;
  textColor: string;
  textShadow: boolean;
  iconShadow: boolean;
  clockFormat: ClockFormat;
  showSeconds: boolean;
  windowBgColor: string;
  windowTextColor: string;
}

const STORAGE_KEY = 'desktop-settings';

const DEFAULTS: DesktopSettings = {
  backgroundColor: '#1a3a5c',
  textColor: '#ffffff',
  textShadow: true,
  iconShadow: true,
  clockFormat: '24h',
  showSeconds: false,
  windowBgColor: '#ffffff',
  windowTextColor: '#222222',
};

@Injectable({ providedIn: 'root' })
export class DesktopSettingsService {
  private doc = inject(DOCUMENT);

  private _settings = signal<DesktopSettings>(this.load());

  readonly backgroundColor = computed(() => this._settings().backgroundColor);
  readonly textColor = computed(() => this._settings().textColor);
  readonly textShadow = computed(() => this._settings().textShadow);
  readonly iconShadow = computed(() => this._settings().iconShadow);
  readonly clockFormat = computed(() => this._settings().clockFormat);
  readonly showSeconds = computed(() => this._settings().showSeconds);
  readonly windowBgColor = computed(() => this._settings().windowBgColor);
  readonly windowTextColor = computed(() => this._settings().windowTextColor);

  constructor() {
    effect(() => {
      this.save(this._settings());
    });
  }

  setBackgroundColor(color: string) {
    this._settings.update((s) => ({ ...s, backgroundColor: color }));
  }

  setTextColor(color: string) {
    this._settings.update((s) => ({ ...s, textColor: color }));
  }

  setTextShadow(enabled: boolean) {
    this._settings.update((s) => ({ ...s, textShadow: enabled }));
  }

  setIconShadow(enabled: boolean) {
    this._settings.update((s) => ({ ...s, iconShadow: enabled }));
  }

  setClockFormat(format: ClockFormat) {
    this._settings.update((s) => ({ ...s, clockFormat: format }));
  }

  setShowSeconds(show: boolean) {
    this._settings.update((s) => ({ ...s, showSeconds: show }));
  }

  setWindowBgColor(color: string) {
    this._settings.update((s) => ({ ...s, windowBgColor: color }));
  }

  setWindowTextColor(color: string) {
    this._settings.update((s) => ({ ...s, windowTextColor: color }));
  }

  formatTime(date: Date): string {
    const { clockFormat, showSeconds } = this._settings();
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds ? { second: '2-digit' } : {}),
      hour12: clockFormat === '12h',
    });
  }

  private load(): DesktopSettings {
    try {
      const raw = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULTS, ...JSON.parse(raw) };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULTS };
  }

  private save(settings: DesktopSettings) {
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }
}
