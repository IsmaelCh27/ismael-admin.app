import { Component, input, output } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'admin-navbar',
  imports: [AvatarModule, ButtonModule, TieredMenu],
  templateUrl: './navbar.html',
})
export class Navbar {
  visible = input.required<boolean>();

  close = output<boolean>();
  logout = output();

  public items: MenuItem[] = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout.emit();
      },
    },
  ];

  handleClick() {
    this.close.emit(!this.visible());
  }
}
