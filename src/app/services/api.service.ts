// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  Apellido: string;
  Nombre: string;
  Saldo: number | string;
  Status: 0 | 1 | string;
}

export interface Sucursal {
  Id_Suc: number | string;
  Nombre_Suc: string;
  Dir_Suc: string;
  Cant_Emp_Suc: number | string;
}

export interface Venta {
  Suc1: number | string;
  Suc2: number | string;
  Suc3: number | string;
  Suc4: number | string;
  Suc5: number | string;
}

export interface Mes {
  Nro: number | string;
  Mes: string;
  CDias: number | string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost/programacion2/api';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.base}/Get_Clientes.php`);
  }

  getSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.base}/Get_Sucus.php`);
  }

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.base}/Get_Ventas.php`);
  }

  getMeses(): Observable<Mes[]> {
    return this.http.get<Mes[]>(`${this.base}/Get_Meses.php`);
  }
}
