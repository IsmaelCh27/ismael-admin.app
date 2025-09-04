import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'admin-navbar',
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    TieredMenu,
  ],
  templateUrl: './navbar.html',
})
export class Navbar {
  visible = input.required<boolean>();

  newVisible = output<boolean>();

  public items: MenuItem[] = [
    {
      label: 'Document',
      icon: 'pi pi-file',
    },
    {
      separator: true,
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
    },
  ];

  handleClick() {
    this.newVisible.emit(!this.visible());
  }
}
