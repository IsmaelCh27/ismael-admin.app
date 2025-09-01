import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Notification } from './shared/components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ismael-admin');
}
