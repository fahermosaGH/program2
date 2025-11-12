import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Sucursal } from '../services/api.service';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sucursales.html',
  styleUrls: ['./sucursales.css']
})
export class Sucursales implements OnInit {
  sucursales: Sucursal[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSucursales().subscribe({
      next: (data) => { this.sucursales = data; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar las sucursales'; this.loading = false; }
    });
  }
}

