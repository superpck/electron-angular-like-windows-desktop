import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  editing = signal(false);

  profile = signal<ProfileData>({
    name: 'Alex Johnson',
    role: 'Senior Developer',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    bio: 'Passionate developer who loves building clean, performant applications and solving complex problems with elegant solutions.',
    avatar: '',
  });

  draft = signal<ProfileData>({ ...this.profile() });

  initials = computed(() => {
    return this.profile().name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  });

  stats = [
    { label: 'Projects', value: '24' },
    { label: 'Commits', value: '1.2k' },
    { label: 'Reviews', value: '318' },
  ];

  startEdit() {
    this.draft.set({ ...this.profile() });
    this.editing.set(true);
  }

  saveEdit() {
    this.profile.set({ ...this.draft() });
    this.editing.set(false);
  }

  cancelEdit() {
    this.draft.set({ ...this.profile() });
    this.editing.set(false);
  }

  patchDraft(field: keyof ProfileData, value: string) {
    this.draft.update(d => ({ ...d, [field]: value }));
  }
}
