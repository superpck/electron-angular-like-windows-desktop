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
import { MatTabsModule } from '@angular/material/tabs';
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

const PRESET_TASKBAR_BG_COLORS = [
  { label: 'Light Gray (Default)', value: '#f3f3f3' },
  { label: 'White', value: '#ffffff' },
  { label: 'Silver', value: '#e0e0e0' },
  { label: 'Warm Gray', value: '#edede9' },
  { label: 'Dark', value: '#1f1f1f' },
  { label: 'Midnight Blue', value: '#1a3a5c' },
  { label: 'Custom', value: '' },
];

const PRESET_TASKBAR_TEXT_COLORS = [
  { label: 'Dark (Default)', value: '#1f1f1f' },
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#444444' },
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#e0e0e0' },
  { label: 'Custom', value: '' },
];

const PRESET_START_BTN_BG_COLORS = [
  { label: 'Blue (Default)', value: '#0067c0' },
  { label: 'Dark Blue', value: '#003d80' },
  { label: 'Sky Blue', value: '#0099e6' },
  { label: 'Black', value: '#1f1f1f' },
  { label: 'Dark Gray', value: '#444444' },
  { label: 'White', value: '#ffffff' },
  { label: 'Accent Green', value: '#107c10' },
  { label: 'Accent Purple', value: '#6b2fa0' },
  { label: 'Custom', value: '' },
];

const PRESET_START_BTN_TEXT_COLORS = [
  { label: 'White (Default)', value: '#ffffff' },
  { label: 'Light Gray', value: '#e0e0e0' },
  { label: 'Dark', value: '#1f1f1f' },
  { label: 'Black', value: '#000000' },
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
    MatTabsModule,
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
  presetTaskbarBgColors = PRESET_TASKBAR_BG_COLORS;
  presetTaskbarTextColors = PRESET_TASKBAR_TEXT_COLORS;
  presetStartBtnBgColors = PRESET_START_BTN_BG_COLORS;
  presetStartBtnTextColors = PRESET_START_BTN_TEXT_COLORS;

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

  selectedTaskbarBgPreset = signal(
    PRESET_TASKBAR_BG_COLORS.find((p) => p.value === this.settingsService.taskbarBgColor()) ??
      PRESET_TASKBAR_BG_COLORS.at(-1)!,
  );
  customTaskbarBgColor = signal(this.settingsService.taskbarBgColor());

  selectedTaskbarTextPreset = signal(
    PRESET_TASKBAR_TEXT_COLORS.find((p) => p.value === this.settingsService.taskbarTextColor()) ??
      PRESET_TASKBAR_TEXT_COLORS.at(-1)!,
  );
  customTaskbarTextColor = signal(this.settingsService.taskbarTextColor());

  selectedStartBtnBgPreset = signal(
    PRESET_START_BTN_BG_COLORS.find((p) => p.value === this.settingsService.startBtnBgColor()) ??
      PRESET_START_BTN_BG_COLORS.at(-1)!,
  );
  customStartBtnBgColor = signal(this.settingsService.startBtnBgColor());

  selectedStartBtnTextPreset = signal(
    PRESET_START_BTN_TEXT_COLORS.find((p) => p.value === this.settingsService.startBtnTextColor()) ??
      PRESET_START_BTN_TEXT_COLORS.at(-1)!,
  );
  customStartBtnTextColor = signal(this.settingsService.startBtnTextColor());

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

  get previewTaskbarBgColor(): string {
    return this.selectedTaskbarBgPreset().value || this.customTaskbarBgColor();
  }

  get previewTaskbarTextColor(): string {
    return this.selectedTaskbarTextPreset().value || this.customTaskbarTextColor();
  }

  get previewStartBtnBgColor(): string {
    return this.selectedStartBtnBgPreset().value || this.customStartBtnBgColor();
  }

  get previewStartBtnTextColor(): string {
    return this.selectedStartBtnTextPreset().value || this.customStartBtnTextColor();
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

  onTaskbarBgPresetChange(preset: (typeof PRESET_TASKBAR_BG_COLORS)[0]) {
    this.selectedTaskbarBgPreset.set(preset);
    if (preset.value) this.customTaskbarBgColor.set(preset.value);
  }

  onTaskbarBgCustomChange(value: string) {
    this.customTaskbarBgColor.set(value);
    this.selectedTaskbarBgPreset.set(PRESET_TASKBAR_BG_COLORS.at(-1)!);
  }

  onTaskbarTextPresetChange(preset: (typeof PRESET_TASKBAR_TEXT_COLORS)[0]) {
    this.selectedTaskbarTextPreset.set(preset);
    if (preset.value) this.customTaskbarTextColor.set(preset.value);
  }

  onTaskbarTextCustomChange(value: string) {
    this.customTaskbarTextColor.set(value);
    this.selectedTaskbarTextPreset.set(PRESET_TASKBAR_TEXT_COLORS.at(-1)!);
  }

  onStartBtnBgPresetChange(preset: (typeof PRESET_START_BTN_BG_COLORS)[0]) {
    this.selectedStartBtnBgPreset.set(preset);
    if (preset.value) this.customStartBtnBgColor.set(preset.value);
  }

  onStartBtnBgCustomChange(value: string) {
    this.customStartBtnBgColor.set(value);
    this.selectedStartBtnBgPreset.set(PRESET_START_BTN_BG_COLORS.at(-1)!);
  }

  onStartBtnTextPresetChange(preset: (typeof PRESET_START_BTN_TEXT_COLORS)[0]) {
    this.selectedStartBtnTextPreset.set(preset);
    if (preset.value) this.customStartBtnTextColor.set(preset.value);
  }

  onStartBtnTextCustomChange(value: string) {
    this.customStartBtnTextColor.set(value);
    this.selectedStartBtnTextPreset.set(PRESET_START_BTN_TEXT_COLORS.at(-1)!);
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
    this.settingsService.setTaskbarBgColor(this.previewTaskbarBgColor);
    this.settingsService.setTaskbarTextColor(this.previewTaskbarTextColor);
    this.settingsService.setStartBtnBgColor(this.previewStartBtnBgColor);
    this.settingsService.setStartBtnTextColor(this.previewStartBtnTextColor);
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
    this.selectedTaskbarBgPreset.set(PRESET_TASKBAR_BG_COLORS[0]);
    this.customTaskbarBgColor.set(PRESET_TASKBAR_BG_COLORS[0].value);
    this.selectedTaskbarTextPreset.set(PRESET_TASKBAR_TEXT_COLORS[0]);
    this.customTaskbarTextColor.set(PRESET_TASKBAR_TEXT_COLORS[0].value);
    this.selectedStartBtnBgPreset.set(PRESET_START_BTN_BG_COLORS[0]);
    this.customStartBtnBgColor.set(PRESET_START_BTN_BG_COLORS[0].value);
    this.selectedStartBtnTextPreset.set(PRESET_START_BTN_TEXT_COLORS[0]);
    this.customStartBtnTextColor.set(PRESET_START_BTN_TEXT_COLORS[0].value);
  }

  comparePreset(a: { value: string }, b: { value: string }): boolean {
    return a?.value === b?.value;
  }
}
