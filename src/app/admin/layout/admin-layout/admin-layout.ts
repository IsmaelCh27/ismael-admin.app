import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  visibleSidebar = signal(true);

  addVisible(value: boolean) {
    this.visibleSidebar.set(value);
  }
}
