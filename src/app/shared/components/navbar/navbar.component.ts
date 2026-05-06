import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  theme = inject(ThemeService);
  notifService = inject(NotificationService);
  auth = inject(AuthService);

  get userInitial(): string {
    return this.auth.getUserName()?.charAt(0).toUpperCase() ?? 'U';
  }

  get userName(): string {
    return this.auth.getUserName() || this.auth.currentUser()?.email || 'Usuario';
  }

  get userRole(): string {
    return this.auth.getUserRole();
  }
}
