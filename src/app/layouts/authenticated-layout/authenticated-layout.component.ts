import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, ProgressBarModule],
  templateUrl: './authenticated-layout.component.html'
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly loadingService = inject(LoadingService);

  logout(): void {
    this.authService.logout().finally(() => this.router.navigate(['/auth/login']));
  }
}
