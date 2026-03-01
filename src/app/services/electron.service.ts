import { Injectable } from '@angular/core';

export interface NetworkInterface {
  name: string;
  address: string;
  family: string;
  mac: string;
}

export interface DiskInfo {
  name: string;
  mount: string;
  total: number;
  free: number;
  used?: number;
}

export interface SystemInfo {
  computer: {
    hostname: string;
    os: string;
    platform: string;
    arch: string;
    uptime: number;
  };
  cpu: {
    model: string;
    cores: number;
    speed: number;
    usage: number;
  };
  memory: {
    total: number;
    free: number;
  };
  network: NetworkInterface[];
  disks: DiskInfo[];
  versions: {
    electron: string;
    node: string;
    chrome: string;
  };
}

export interface PreloadDebug {
  preloadPath: string;
  preloadExists: boolean;
  isPackaged: boolean;
  resourcesPath: string;
  logPath: string;
  logContent: string;
}

interface ElectronAPI {
  getSystemInfo: () => SystemInfo;
  getPreloadDebug: () => Promise<PreloadDebug>;
}

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private readonly api: ElectronAPI | null =
    typeof window !== 'undefined' && 'electronAPI' in window
      ? (window as unknown as { electronAPI: ElectronAPI }).electronAPI
      : null;

  isElectron(): boolean {
    return this.api !== null;
  }

  getSystemInfo(): SystemInfo | null {
    return this.api?.getSystemInfo() ?? null;
  }

  getPreloadDebug(): Promise<PreloadDebug> | null {
    return this.api?.getPreloadDebug() ?? null;
  }
}
