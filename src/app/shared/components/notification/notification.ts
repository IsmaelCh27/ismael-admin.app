import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-notification',
  imports: [ToastModule],
  templateUrl: './notification.html',
})
export class Notification {}
