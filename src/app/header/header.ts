import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  title = 'Bienvenidos';
  navVisible = true;
  isAuth = false;

  constructor(private auth: AuthService, private router: Router) {
    // chequear estado al cargar y en cada navegación
    const check = () => this.auth.me(true).subscribe(m => this.isAuth = !!m.auth);
    check();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => check());
  }

  get ButName() { return this.navVisible ? 'Ocultar' : 'Mostrar'; }
  barra(): void { this.navVisible = !this.navVisible; }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.isAuth = false;
      this.router.navigate(['/login']);
    });
  }
}
