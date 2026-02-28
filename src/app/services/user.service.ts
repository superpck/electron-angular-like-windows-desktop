import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface RandomUserName {
  title: string;
  first: string;
  last: string;
}

export interface RandomUserLocation {
  street: { number: number; name: string };
  city: string;
  state: string;
  country: string;
  postcode: string | number;
}

export interface RandomUser {
  gender: string;
  name: RandomUserName;
  location: RandomUserLocation;
  email: string;
  login: { uuid: string; username: string };
  dob: { date: string; age: number };
  phone: string;
  cell: string;
  picture: { thumbnail: string; medium: string; large: string };
  nat: string;
}

interface RandomUserApiResponse {
  results: RandomUser[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  readonly users = signal<RandomUser[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedUser = signal<RandomUser | null>(null);

  fetchUsers(): void {
    if (this.users().length > 0) return; // already loaded
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<RandomUserApiResponse>('https://randomuser.me/api/?results=100')
      .subscribe({
        next: (res) => {
          this.users.set(res.results);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load users: ' + (err.message ?? 'Unknown error'));
          this.loading.set(false);
        },
      });
  }

  setSelectedUser(user: RandomUser): void {
    this.selectedUser.set({ ...user });
  }

  updateUser(uuid: string, patch: Partial<Pick<RandomUser, 'name' | 'email' | 'phone' | 'cell'>>): void {
    this.users.update((list) =>
      list.map((u) => (u.login.uuid === uuid ? { ...u, ...patch, name: { ...u.name, ...patch.name } } : u)),
    );
    const sel = this.selectedUser();
    if (sel?.login.uuid === uuid) {
      this.selectedUser.update((u) => u ? { ...u, ...patch, name: { ...u.name, ...patch.name } } : u);
    }
  }

  deleteUser(uuid: string): void {
    this.users.update((list) => list.filter((u) => u.login.uuid !== uuid));
    if (this.selectedUser()?.login.uuid === uuid) {
      this.selectedUser.set(null);
    }
  }
}
