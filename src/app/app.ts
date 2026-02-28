import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyToastrComponent } from './shares/my-toastr/my-toastr.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyToastrComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-desktop');
}
