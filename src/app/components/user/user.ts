import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UserService, RandomUser } from '../../services/user.service';
import { WindowManagerService } from '../../services/window-manager.service';
import { UserEdit } from './user-edit/user-edit';
import { MyAlertService } from '../../shares/my-alert/my-alert.service';
import { MyToastrService } from '../../shares/my-toastr/my-toastr.service';

const USER_EDIT_ITEM = {
  id: 'user-edit',
  label: 'Edit User',
  icon: 'assets/images/logo2.png',
  component: UserEdit,
  defaultWidth: 480,
  defaultHeight: 520,
};

@Component({
  selector: 'app-user',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class User implements OnInit {
  private userService = inject(UserService);
  private windowManager = inject(WindowManagerService);
  private myAlert = inject(MyAlertService);
  private toastr = inject(MyToastrService);

  /** uuid of the user currently being edited — all edit/delete buttons are disabled while set */
  readonly editingId = signal<string | null>(null);

  // Clear editing lock when user-edit window is closed (X button or save)
  private readonly _editLockEffect = effect(() => {
    if (this.windowManager.lastClosedWindow()?.id === 'user-edit') {
      this.editingId.set(null);
    }
  });

  readonly loading = this.userService.loading;
  readonly error = this.userService.error;
  readonly totalUsers = computed(() => this.userService.users().length);

  search = signal('');
  currentPage = signal(0);
  pageSize = signal(10);
  readonly pageSizeOptions = [5, 10, 20, 50];

  readonly filteredUsers = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.userService.users();
    return this.userService.users().filter(
      (u) =>
        u.name.first.toLowerCase().includes(q) ||
        u.name.last.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.country.toLowerCase().includes(q),
    );
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize())),
  );

  readonly pagedUsers = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  readonly pageStart = computed(() => this.currentPage() * this.pageSize() + 1);
  readonly pageEnd = computed(() =>
    Math.min((this.currentPage() + 1) * this.pageSize(), this.filteredUsers().length),
  );

  ngOnInit(): void {
    this.userService.fetchUsers();
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(0);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  prevPage(): void {
    if (this.currentPage() > 0) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) this.currentPage.update((p) => p + 1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  editUser(user: RandomUser): void {
    this.editingId.set(user.login.uuid);
    this.userService.setSelectedUser(user);
    this.windowManager.requestOpen(USER_EDIT_ITEM);
  }

  async deleteUser(user: RandomUser): Promise<void> {
    const confirmed = await this.myAlert.confirm(
      `Delete user "${user.name.first} ${user.name.last}"?\nThis action cannot be undone.`,
      { title: 'Delete User', confirmLabel: 'Delete', cancelLabel: 'Cancel' },
    );
    if (confirmed) {
      this.userService.deleteUser(user.login.uuid);
      this.toastr.success(`Deleted "${user.name.first} ${user.name.last}" successfully`);
    }
  }

  fullName(user: RandomUser): string {
    return `${user.name.first} ${user.name.last}`;
  }
}
