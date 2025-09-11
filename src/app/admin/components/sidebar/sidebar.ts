import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  Laptop,
  LogOut,
  LucideAngularModule,
  type LucideIconData,
} from 'lucide-angular';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';

type MenuEntry = {
  label: string;
  icon?: LucideIconData;
  link?: string;
};

@Component({
  selector: 'admin-sidebar',
  imports: [
    LucideAngularModule,
    TooltipModule,
    RouterLink,
    RouterLinkActive,
    DrawerModule,
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly LogOutIcon = LogOut;

  menus: MenuEntry[] = [
    {
      label: 'Proyectos',
      icon: Laptop,
      link: '/admin/projects',
    },
    {
      label: 'Imagenes',
      icon: Laptop,
      link: '/admin/images',
    },
  ];

  xl = signal<boolean>(window.innerWidth < 1280);
  sm = signal<boolean>(window.innerWidth < 640);

  visible = input.required<boolean>();
  close = output<boolean>();
  logout = output<void>();

  isExpanded = computed(() => {
    return (!this.xl() && this.visible()) || (!this.visible() && this.xl());
  });

  private _onResize?: () => void;

  constructor() {
    this.updateBreakpoints();
    this._onResize = () => this.updateBreakpoints();
    window.addEventListener('resize', this._onResize);
  }

  ngOnDestroy(): void {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }
  }

  private updateBreakpoints() {
    const w = window.innerWidth;
    this.sm.set(w < 640);
    this.xl.set(w < 1280);
  }

  onHide = () => {
    this.close.emit(!this.visible());
  };

  handleLogout() {
    this.logout.emit();
  }
}
