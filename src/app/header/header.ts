import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';          
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  get ButName() { return this.navVisible ? 'Ocultar' : 'Mostrar'; }
  barra(): void { this.navVisible = !this.navVisible; }
}


