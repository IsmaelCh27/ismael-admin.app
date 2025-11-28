import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface NotificationOptions {
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
  summary?: string;
  detail?: string;
  life?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService);

  show(options: NotificationOptions) {
    this.messageService.add({
      severity: options.severity ?? 'success',
      summary: options.summary ?? '',
      detail: options.detail ?? '',
      life: options.life ?? 3000,
    });
  }

  success(summary: string, detail?: string) {
    this.show({ severity: 'success', summary, detail });
  }

  info(summary: string, detail?: string) {
    this.show({ severity: 'info', summary, detail });
  }

  warn(summary: string, detail?: string) {
    this.show({ severity: 'warn', summary, detail });
  }

  error(summary: string, detail?: string, life: number = 6000) {
    this.show({ severity: 'error', summary, detail, life });
  }

  secondary(summary: string, detail?: string) {
    this.show({ severity: 'secondary', summary, detail });
  }

  contrast(summary: string, detail?: string) {
    this.show({ severity: 'contrast', summary, detail });
  }

  clear() {
    this.messageService.clear();
  }
}
