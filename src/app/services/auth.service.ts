import { Injectable, signal } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal<boolean>(localStorage.getItem('mock_auth') === 'true');
  private readonly keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId
  });
  private initialized = false;

  initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }
    this.initialized = true;
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
        // fallback local para dev sem servidor Keycloak
        this.authenticated.set(localStorage.getItem('mock_auth') === 'true');
      });
  }

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  login(): Observable<void> {
    return from(this.keycloak.login()).pipe(
      map(() => {
        this.authenticated.set(true);
        localStorage.setItem('mock_auth', 'true');
      }),
      catchError(() => {
        this.authenticated.set(true);
        localStorage.setItem('mock_auth', 'true');
        return of(void 0);
      })
    );
  }

  logout(): Promise<void> {
    this.authenticated.set(false);
    localStorage.removeItem('mock_auth');
    return this.keycloak.logout().catch(() => Promise.resolve());
  }
}
