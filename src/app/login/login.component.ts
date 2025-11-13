// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="login-wrap">
    <div class="card">
      <h1>Ingresar</h1>
      <p class="subtitle">Usá tu usuario para acceder al sistema</p>

      <form #f="ngForm" (ngSubmit)="submit(f)" novalidate>
        <label class="field">
          <span>Usuario</span>
          <input
            name="username"
            [(ngModel)]="username"
            required
            autocomplete="username"
            [class.invalid]="f.submitted && !f.controls['username']?.valid"
          />
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            required
            autocomplete="current-password"
            [class.invalid]="f.submitted && !f.controls['password']?.valid"
          />
        </label>

       <button class="btn" type="submit" [disabled]="loading">
          {{ loading ? 'Ingresando…' : 'Entrar' }}
        </button>

        <p *ngIf="error" class="error">{{ error }}</p>
      </form>

    </div>
  </div>
  `,
  styles: [`
  *{ box-sizing:border-box }

  .login-wrap{
    min-height: calc(100vh - 64px);
    display:flex; align-items:flex-start; justify-content:center;
    padding:48px 16px;
  }

  .card{
    width:100%; max-width:420px;
    background:#151d24;                 /* <-- color del cuadro */
    color:#e6eef3;
    border:1px solid rgba(255,255,255,.08);
    border-radius:14px;
    padding:28px;
    box-shadow: 0 14px 40px rgba(0,0,0,.45);
    animation: pop .2s ease-out;
  }

  @keyframes pop{ from{ transform:translateY(6px); opacity:.85 } to{ transform:translateY(0); opacity:1 } }

  h1{ margin:0 0 6px; font-size:28px; line-height:1.1 }
  .subtitle{ margin:0 0 18px; color:#9fb0bc; font-size:14px }

  .field{ display:flex; flex-direction:column; gap:6px; margin-bottom:14px }
  .field span{ font-size:13px; color:#9fb0bc }

  input{
    width:100%;
    background:#0e141a;                 /* fondo del input */
    color:#e6eef3;
    border:1px solid rgba(255,255,255,.08);
    border-radius:10px;
    padding:12px;
    outline:none;
    transition:border-color .15s, box-shadow .15s;
  }
  input:focus{
    border-color: rgba(46,234,130,.7);
    box-shadow: 0 0 0 3px rgba(46,234,130,.15);
  }
  input.invalid{ border-color: rgba(255,107,107,.75) }

  .btn{
    width:100%;
    background:#2eea82;                 /* acento verde */
    color:#0a0f0c; font-weight:700;
    border:0; border-radius:10px;
    padding:12px 14px; cursor:pointer;
    transition: filter .15s, transform .02s;
  }
  .btn:hover{ filter:brightness(1.05) }
  .btn:active{ transform:translateY(1px) }
  .btn[disabled]{ opacity:.6; cursor:not-allowed }

  .error{ margin-top:10px; color:#ff6b6b; font-size:14px }
  .hint{ margin-top:16px; color:#9fb0bc; font-size:12px; text-align:center }

  @media (max-width:520px){ .card{ padding:22px } h1{ font-size:24px } }
  `]
})
export class LoginComponent {
  username = 'admin';
  password = 'admin';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(form: NgForm) {
    if (form.invalid || this.loading) return;
    this.error = ''; this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/ventas']),
      error: () => { this.error = 'Usuario o contraseña incorrectos'; this.loading = false; }
    });
  }
}
