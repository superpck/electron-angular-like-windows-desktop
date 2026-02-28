import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClockFormat, DesktopSettingsService } from '../../services/desktop-settings.service';

const PRESET_COLORS = [
  // Dark
  { label: 'Midnight Blue', value: '#1a3a5c' },
  { label: 'Dark Navy', value: '#0d1b2a' },
  { label: 'Forest Green', value: '#1a3d2b' },
  { label: 'Deep Purple', value: '#2d1b4e' },
  { label: 'Charcoal', value: '#2c2c2c' },
  { label: 'Slate', value: '#3b4a5a' },
  // Light
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#f0f0f0' },
  { label: 'Light Blue', value: '#dce8f5' },
  { label: 'Soft Green', value: '#d4ede1' },
  { label: 'Lavender', value: '#e8e0f5' },
  { label: 'Warm Sand', value: '#f5efe0' },
  // Custom
  { label: 'Custom', value: '' },
];

const PRESET_TEXT_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#e0e0e0' },
  { label: 'Dark Gray', value: '#333333' },
  { label: 'Black', value: '#000000' },
  { label: 'Custom', value: '' },
];

const PRESET_WINDOW_BG_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#f5f5f5' },
  { label: 'Light Blue', value: '#eef4fb' },
  { label: 'Dark Gray', value: '#2c2c2c' },
  { label: 'Midnight Blue', value: '#1a3a5c' },
  { label: 'Custom', value: '' },
];

const PRESET_WINDOW_TEXT_COLORS = [
  { label: 'Dark (Default)', value: '#222222' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#e0e0e0' },
  { label: 'Custom', value: '' },
];

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private settingsService = inject(DesktopSettingsService);
  private snackBar = inject(MatSnackBar);

  presetColors = PRESET_COLORS;
  presetTextColors = PRESET_TEXT_COLORS;

  selectedPreset = signal(
    PRESET_COLORS.find((p) => p.value === this.settingsService.backgroundColor()) ??
      PRESET_COLORS.at(-1)!,
  );
  customColor = signal(this.settingsService.backgroundColor());

  selectedTextPreset = signal(
    PRESET_TEXT_COLORS.find((p) => p.value === this.settingsService.textColor()) ??
      PRESET_TEXT_COLORS.at(-1)!,
  );
  customTextColor = signal(this.settingsService.textColor());

  clockFormat = signal<ClockFormat>(this.settingsService.clockFormat());
  showSeconds = signal(this.settingsService.showSeconds());
  textShadow = signal(this.settingsService.textShadow());
  iconShadow = signal(this.settingsService.iconShadow());

  presetWindowBgColors = PRESET_WINDOW_BG_COLORS;
  presetWindowTextColors = PRESET_WINDOW_TEXT_COLORS;

  selectedWindowBgPreset = signal(
    PRESET_WINDOW_BG_COLORS.find((p) => p.value === this.settingsService.windowBgColor()) ??
      PRESET_WINDOW_BG_COLORS.at(-1)!,
  );
  customWindowBgColor = signal(this.settingsService.windowBgColor());

  selectedWindowTextPreset = signal(
    PRESET_WINDOW_TEXT_COLORS.find((p) => p.value === this.settingsService.windowTextColor()) ??
      PRESET_WINDOW_TEXT_COLORS.at(-1)!,
  );
  customWindowTextColor = signal(this.settingsService.windowTextColor());

  get previewColor(): string {
    return this.selectedPreset().value || this.customColor();
  }

  get previewTextColor(): string {
    return this.selectedTextPreset().value || this.customTextColor();
  }

  get previewWindowBgColor(): string {
    return this.selectedWindowBgPreset().value || this.customWindowBgColor();
  }

  get previewWindowTextColor(): string {
    return this.selectedWindowTextPreset().value || this.customWindowTextColor();
  }

  onPresetChange(preset: (typeof PRESET_COLORS)[0]) {
    this.selectedPreset.set(preset);
    if (preset.value) {
      this.customColor.set(preset.value);
    }
  }

  onCustomColorChange(value: string) {
    this.customColor.set(value);
    this.selectedPreset.set(PRESET_COLORS.at(-1)!);
  }

  onTextPresetChange(preset: (typeof PRESET_TEXT_COLORS)[0]) {
    this.selectedTextPreset.set(preset);
    if (preset.value) {
      this.customTextColor.set(preset.value);
    }
  }

  onCustomTextColorChange(value: string) {
    this.customTextColor.set(value);
    this.selectedTextPreset.set(PRESET_TEXT_COLORS.at(-1)!);
  }

  onClockFormatChange(format: ClockFormat) {
    this.clockFormat.set(format);
  }

  onShowSecondsChange(show: boolean) {
    this.showSeconds.set(show);
  }

  onTextShadowChange(enabled: boolean) {
    this.textShadow.set(enabled);
  }

  onIconShadowChange(enabled: boolean) {
    this.iconShadow.set(enabled);
  }

  onWindowBgPresetChange(preset: (typeof PRESET_WINDOW_BG_COLORS)[0]) {
    this.selectedWindowBgPreset.set(preset);
    if (preset.value) {
      this.customWindowBgColor.set(preset.value);
    }
  }

  onWindowBgCustomChange(value: string) {
    this.customWindowBgColor.set(value);
    this.selectedWindowBgPreset.set(PRESET_WINDOW_BG_COLORS.at(-1)!);
  }

  onWindowTextPresetChange(preset: (typeof PRESET_WINDOW_TEXT_COLORS)[0]) {
    this.selectedWindowTextPreset.set(preset);
    if (preset.value) {
      this.customWindowTextColor.set(preset.value);
    }
  }

  onWindowTextCustomChange(value: string) {
    this.customWindowTextColor.set(value);
    this.selectedWindowTextPreset.set(PRESET_WINDOW_TEXT_COLORS.at(-1)!);
  }

  save() {
    this.settingsService.setBackgroundColor(this.previewColor);
    this.settingsService.setTextColor(this.previewTextColor);
    this.settingsService.setTextShadow(this.textShadow());
    this.settingsService.setIconShadow(this.iconShadow());
    this.settingsService.setClockFormat(this.clockFormat());
    this.settingsService.setShowSeconds(this.showSeconds());
    this.settingsService.setWindowBgColor(this.previewWindowBgColor);
    this.settingsService.setWindowTextColor(this.previewWindowTextColor);
    this.snackBar.open('Settings saved', '', { duration: 2000 });
  }

  reset() {
    this.selectedPreset.set(PRESET_COLORS[0]);
    this.customColor.set(PRESET_COLORS[0].value);
    this.selectedTextPreset.set(PRESET_TEXT_COLORS[0]);
    this.customTextColor.set(PRESET_TEXT_COLORS[0].value);
    this.textShadow.set(true);
    this.iconShadow.set(true);
    this.clockFormat.set('24h');
    this.showSeconds.set(false);
    this.selectedWindowBgPreset.set(PRESET_WINDOW_BG_COLORS[0]);
    this.customWindowBgColor.set(PRESET_WINDOW_BG_COLORS[0].value);
    this.selectedWindowTextPreset.set(PRESET_WINDOW_TEXT_COLORS[0]);
    this.customWindowTextColor.set(PRESET_WINDOW_TEXT_COLORS[0].value);
  }

  comparePreset(a: { value: string }, b: { value: string }): boolean {
    return a?.value === b?.value;
  }
}
