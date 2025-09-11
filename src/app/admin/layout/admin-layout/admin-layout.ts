import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar, Sidebar, ConfirmDialog],
  templateUrl: './admin-layout.html',
  providers: [ConfirmationService],
})
export class AdminLayout {
  private router = inject(Router);
  visibleSidebar = signal(true);
  private confirmationService = inject(ConfirmationService);

  onClose(value: boolean) {
    this.visibleSidebar.set(value);
  }

  confirmLogout() {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas cerrar sesión?',
      header: 'Cerrar sesión',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'primary',
      },

      accept: () => {
        this.router.navigate(['/auth/login']);
      },
      reject: () => {},
    });
  }
}
