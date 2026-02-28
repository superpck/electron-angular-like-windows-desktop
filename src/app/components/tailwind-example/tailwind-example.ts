import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tailwind-example',
  imports: [],
  templateUrl: './tailwind-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TailwindExample {
  progress = 65;
}
