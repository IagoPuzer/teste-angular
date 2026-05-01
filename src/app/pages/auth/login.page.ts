import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ButtonModule, ProgressSpinnerModule],
  templateUrl: './login.page.html'
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(false);

  constructor() {
    if (this.authService.isAuthenticated()) {
      void this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.loading.set(true);
    this.authService
      .login()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(() => this.router.navigate(['/dashboard']));
  }
}
