import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import CONFIG from '../../configs/config';

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-about',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatTooltipModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  config = CONFIG;

  buildYear = new Date().getFullYear();

  techStack: TechItem[] = [
    { name: 'Angular', icon: 'assets/images/logo1.png', color: '#dd0031' },
    { name: 'Electron', icon: 'assets/images/logo2.png', color: '#47848f' },
  ];
}
