import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Venta } from '../services/api.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class Ventas implements OnInit {
  suc = ["Mes","Santa Fe","Paraná","Santo Tomé","Rafaela","Rosario"];
  mes = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

  ventas: Venta[] = [];
  loading = true;
  error = '';

  // etiqueta -> campo del backend
  cols = [
    { labelIndex: 1, prop: 'Suc1' }, // Santa Fe
    { labelIndex: 2, prop: 'Suc2' }, // Paraná
    { labelIndex: 3, prop: 'Suc3' }, // Santo Tomé
    { labelIndex: 4, prop: 'Suc4' }, // Rafaela
    { labelIndex: 5, prop: 'Suc5' }, // Rosario
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getVentas().subscribe({
      next: (d) => { this.ventas = d; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar las ventas'; this.loading = false; }
    });
  }

  totalFila(v: Venta): number {
    return this.cols.reduce((acc, c) => acc + +((v as any)[c.prop] ?? 0), 0);
  }
}


