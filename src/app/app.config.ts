import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideKeycloak } from 'keycloak-angular';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { httpLoadingErrorInterceptor } from './core/http-loading-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura }
    }),
    ...(environment.keycloak.enabled
      ? [
          provideKeycloak({
            config: {
              url: environment.keycloak.url,
              realm: environment.keycloak.realm,
              clientId: environment.keycloak.clientId
            }
          })
        ]
      : []),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initialize();
    }),
    provideHttpClient(withInterceptors([httpLoadingErrorInterceptor])),
    provideRouter(routes)
  ]
};
