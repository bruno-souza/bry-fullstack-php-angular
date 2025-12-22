import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationStart } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showUserMenu = false;
  currentUrl = '';
  showMenu$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Inicializa com a URL atual
    this.currentUrl = this.router.url;
    
    // Atualiza currentUrl quando a navegação começar
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });

    // Observable que determina se deve mostrar o menu
    const initialUrl = this.router.url || '';
    const initialIsAuthRoute = initialUrl === '/login' || initialUrl === '/register' || initialUrl === '/' || initialUrl === '';
    const initialShowMenu = this.authService.isLoggedIn() && !initialIsAuthRoute;
    
    this.showMenu$ = this.authService.currentUser.pipe(
      map(user => {
        const isAuthRoute = this.currentUrl === '/login' || this.currentUrl === '/register' || this.currentUrl === '/' || this.currentUrl === '';
        return !!user && !isAuthRoute;
      })
    );
  }

  isAuthRoute(): boolean {
    return this.currentUrl === '/login' || this.currentUrl === '/register' || this.currentUrl === '/' || this.currentUrl === '';
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
