import { Injectable, inject, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import CONFIG from '../configs/config';

export interface JwtPayload {
  uid: number;
  name: string;
  level: 'admin' | 'user';
  iat: number;
  exp: number;
}

interface FakeUser {
  uid: number;
  username: string;
  password: string;
  name: string;
  level: 'admin' | 'user';
}

const FAKE_USERS: FakeUser[] = [
  { uid: 1, username: 'admin', password: 'admin', name: 'Administrator', level: 'admin' },
  { uid: 2, username: 'user', password: 'user', name: 'Regular User', level: 'user' },
];

@Injectable({ providedIn: 'root' })
export class LoginService {
  private doc = inject(DOCUMENT);
  private storage = this.doc.defaultView?.sessionStorage;

  private _token = signal<string | null>(this.storage?.getItem(CONFIG.tokenName) ?? null);

  readonly isLoggedIn = computed(() => this._token() !== null);
  readonly token = computed(() => this._token());

  readonly currentUser = computed<JwtPayload | null>(() => {
    const t = this._token();
    if (!t) return null;
    return this.decodePayload(t);
  });

  login(username: string, password: string): boolean {
    const user = FAKE_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) return false;

    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      uid: user.uid,
      name: user.name,
      level: user.level,
      iat: now,
      exp: now + 60 * 60 * 8, // 8 hours
    };

    const token = this.createFakeJwt(payload);
    this.storage?.setItem(CONFIG.tokenName, token);
    this._token.set(token);
    return true;
  }

  logout(): void {
    this.storage?.removeItem(CONFIG.tokenName);
    this._token.set(null);
  }

  private createFakeJwt(payload: JwtPayload): string {
    const header = this.b64({ alg: 'HS256', typ: 'JWT' });
    const body = this.b64(payload);
    const sig = this.b64('fake-signature');
    return `${header}.${body}.${sig}`;
  }

  private decodePayload(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1])) as JwtPayload;
    } catch {
      return null;
    }
  }

  private b64(data: unknown): string {
    return btoa(typeof data === 'string' ? data : JSON.stringify(data))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
