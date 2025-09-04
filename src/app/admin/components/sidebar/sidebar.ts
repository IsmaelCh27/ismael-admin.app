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
  readonly LogOut = LogOut;
  menus: MenuEntry[] = [
    // {
    //   label: 'Dashboard',
    //   icon: LayoutDashboard,
    //   link: '/admin',
    // },
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

  // Breakpoints: xl() === true for widths < 1280 (collapsed mode); sm() === true for widths < 640 (drawer mode)
  xl = signal(window.innerWidth < 1280);
  sm = signal(window.innerWidth < 640);
  // Visible is controlled by parent; when in desktop (not xl), it means expanded/collapsed
  visible = input.required<boolean>();
  newVisible = output<boolean>();

  // Expanded only when not xl (>=1280) and visible is true
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

  close = () => {
    this.newVisible.emit(!this.visible());
  };

  trackByLabel(_index: number, item: MenuEntry) {
    return item.label;
  }
}
