import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from '@shared/components/notification/notification';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ismael-admin');
}
