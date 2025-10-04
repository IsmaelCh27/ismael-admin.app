import { Navbar } from '@admin/components/navbar/navbar';
import { Sidebar } from '@admin/components/sidebar/sidebar';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar, Sidebar, ConfirmDialog, ButtonModule],
  templateUrl: './admin-layout.html',
  providers: [ConfirmationService],
})
export class AdminLayout {
  visibleSidebar = signal(true);

  private confirmationService = inject(ConfirmationService);

  private authService = inject(AuthService);
  isLoading = signal(false);

  onClose(value: boolean) {
    this.visibleSidebar.set(value);
  }

  confirmLogout() {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas cerrar sesión?',
      header: 'Cerrar sesión',
      icon: 'pi pi-info-circle',
      closable: false,
      accept: () => {},
      reject: () => {},
    });
  }

  async logoutAccept() {
    this.isLoading.set(true);
    await this.authService.signOut();

    this.confirmationService.close();
    this.isLoading.set(false);
  }

  logoutReject() {
    this.confirmationService.close();
  }
}
