import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MyTabsModule } from '../../shares/my-tabs/my-tabs.module';

export interface DemoUser {
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-material-example',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatStepperModule,
    ...MyTabsModule,
  ],
  templateUrl: './material-example.html',
  styleUrl: './material-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialExample {
  private fb = new FormBuilder();

  // ── Form ──────────────────────────────────────
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: [''],
    agree: [false],
    color: ['blue'],
    volume: [40],
    notifications: [true],
  });

  roles = ['Admin', 'Editor', 'Viewer'];

  // ── Chips ─────────────────────────────────────
  chips = signal(['Angular', 'Material', 'TypeScript', 'Tailwind']);
  removeChip(chip: string) {
    this.chips.update((c) => c.filter((x) => x !== chip));
  }

  // ── Progress ──────────────────────────────────
  progressValue = signal(60);

  // ── Table ─────────────────────────────────────
  tableColumns = ['name', 'role', 'status'];
  tableData: DemoUser[] = [
    { name: 'Alice Johnson', role: 'Admin',  status: 'Active'   },
    { name: 'Bob Smith',     role: 'Editor', status: 'Pending'  },
    { name: 'Carol White',   role: 'Viewer', status: 'Inactive' },
  ];
}
