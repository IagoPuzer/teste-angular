import { Injectable, signal } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly mockMode = !environment.keycloak.enabled;
  private readonly authenticated = signal<boolean>(localStorage.getItem('mock_auth') === 'true');
  private readonly keycloak = environment.keycloak.enabled
    ? new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      })
    : null;
  private initialized = false;

  initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }
    this.initialized = true;
    if (this.mockMode || !this.keycloak) {
      this.authenticated.set(localStorage.getItem('mock_auth') === 'true');
      return Promise.resolve();
    }
    return this.keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false
      })
      .then((authenticated) => {
        this.authenticated.set(authenticated);
      })
      .catch(() => {
        this.authenticated.set(false);
      });
  }

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  login(): Observable<void> {
    if (this.mockMode || !this.keycloak) {
      this.authenticated.set(true);
      localStorage.setItem('mock_auth', 'true');
      return of(void 0);
    }
    return from(this.keycloak.login({ redirectUri: `${window.location.origin}/dashboard` })).pipe(
      map(() => {
        this.authenticated.set(true);
      })
    );
  }

  logout(): Promise<void> {
    this.authenticated.set(false);
    localStorage.removeItem('mock_auth');
    if (this.mockMode || !this.keycloak) {
      return Promise.resolve();
    }
    return this.keycloak.logout().catch(() => Promise.resolve());
  }
}
