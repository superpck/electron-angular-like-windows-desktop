import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { WindowManagerService } from '../../../services/window-manager.service';

@Component({
  selector: 'app-user-edit',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEdit implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private windowManager = inject(WindowManagerService);

  readonly selectedUser = this.userService.selectedUser;
  saved = signal(false);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    cell: [''],
  });

  ngOnInit(): void {
    const user = this.selectedUser();
    if (user) {
      this.form.patchValue({
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        phone: user.phone,
        cell: user.cell,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.selectedUser();
    if (!user) return;
    const { firstName, lastName, email, phone, cell } = this.form.getRawValue();
    this.userService.updateUser(user.login.uuid, {
      name: { ...user.name, first: firstName, last: lastName },
      email,
      phone,
      cell,
    });
    this.snackBar.open('User updated', '', { duration: 2000 });
    this.windowManager.requestClose('user-edit');
  }
}
