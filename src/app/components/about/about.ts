import { ChangeDetectionStrategy, Component, DestroyRef, VERSION, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import CONFIG from '../../configs/config';
import { ElectronService, PreloadDebug, SystemInfo } from '../../services/electron.service';

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-about',
  imports: [DecimalPipe, MatButtonModule, MatDividerModule, MatIconModule, MatTooltipModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  private readonly electronService = inject(ElectronService);
  private readonly destroyRef = inject(DestroyRef);

  config = CONFIG;
  buildYear = new Date().getFullYear();
  angularVersion = VERSION.full;

  systemInfo = signal<SystemInfo | null>(null);
  preloadDebug = signal<PreloadDebug | null>(null);

  debugInfo = (() => {
    const hasWindow = typeof window !== 'undefined';
    const hasApi = hasWindow && 'electronAPI' in window;
    const w = window as any;
    const preloadStep: string = w['__preloadStep']?.step ?? '(not set — preload never ran)';
    const preloadError: string = w['__preloadError']?.message ?? '';
    return {
      hasWindow,
      hasApi,
      apiKeys: hasApi ? Object.keys(w['electronAPI']) : [],
      userAgent: hasWindow ? navigator.userAgent : 'N/A',
      preloadStep,
      preloadError,
    };
  })();

  constructor() {
    if (this.electronService.isElectron()) {
      this.systemInfo.set(this.electronService.getSystemInfo());
      this.electronService.getPreloadDebug()?.then(d => this.preloadDebug.set(d));
      const id = setInterval(() => {
        this.systemInfo.set(this.electronService.getSystemInfo());
      }, 2000);
      this.destroyRef.onDestroy(() => clearInterval(id));
    }
  }

  formatBytes(bytes: number): string {
    if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + ' GB';
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(0) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  }

  formatUptime(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    return parts.join(' ');
  }

  techStack: TechItem[] = [
    { name: 'Electron', icon: 'assets/images/electron.png', color: '#47848f' },
    { name: 'Angular', icon: 'assets/images/angular2.png', color: '#dd0031' },
    { name: 'Material', icon: 'assets/images/material_logo.png', color: '#38b2ac' },
    { name: 'Tailwind', icon: 'assets/images/tailwind_logo.png', color: '#38b2ac' },
  ];
}
