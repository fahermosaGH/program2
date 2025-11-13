import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export type Rol = 'admin'|'operador'|'consulta';
export interface Me { auth: boolean; id?: number; username?: string; rol?: Rol; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost/programacion2/api';
  private cache?: Me;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{id:number;username:string;rol:Rol}>(`${this.api}/login.php`, { username, password }, { withCredentials: true })
      .pipe(tap(r => this.cache = { auth:true, id:r.id, username:r.username, rol:r.rol }));
  }

  me(force=false): Observable<Me> {
    if (this.cache && !force) return of(this.cache);
    return this.http.get<Me>(`${this.api}/me.php`, { withCredentials: true })
      .pipe(tap(m => this.cache = m));
  }

  logout() {
    return this.http.post(`${this.api}/logout.php`, {}, { withCredentials: true })
      .pipe(tap(() => this.cache = { auth:false }));
  }

  hasRole(roles: Rol[]) {
    return this.me().pipe(map(m => !!m.auth && (roles.length ? roles.includes(m.rol!) : true)));
  }
}

