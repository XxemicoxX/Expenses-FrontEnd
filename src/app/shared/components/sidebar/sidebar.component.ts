import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: '⬡', route: '/dashboard' },
    { label: 'Gastos',       icon: '◈', route: '/spents' },
    { label: 'Ingresos',     icon: '◇', route: '/incomes' },
    { label: 'Categorías',   icon: '◆', route: '/categories' },
    { label: 'Pagos',        icon: '◉', route: '/payments' },
    { label: 'Tipos',        icon: '◎', route: '/types' },
    { label: 'Usuarios',     icon: '◐', route: '/users' },
  ];

  toggle() {
    this.collapsed.update(v => !v);
  }
}
