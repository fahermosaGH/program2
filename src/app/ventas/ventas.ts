// src/app/ventas/ventas.ts
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService, Venta } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

import { Chart, ChartConfiguration } from 'chart.js/auto';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class Ventas implements OnInit, AfterViewInit, OnDestroy {

  // Etiquetas
  suc = ["Mes","Santa Fe","Paraná","Santo Tomé","Rafaela","Rosario"];
  mes = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

  // Data
  ventas: Venta[] = [];
  ventasEdit: any[] = [];   // copia editable
  loading = true;
  error = '';

  // Columnas
  cols = [
    { labelIndex: 1, prop: 'Suc1' }, // Santa Fe
    { labelIndex: 2, prop: 'Suc2' }, // Paraná
    { labelIndex: 3, prop: 'Suc3' }, // Santo Tomé
    { labelIndex: 4, prop: 'Suc4' }, // Rafaela
    { labelIndex: 5, prop: 'Suc5' }, // Rosario
  ];

  // Auth / edición
  isAdmin = false;
  editMode = false;

  // Chart.js
  isLine = true;
  showChart = true;
  chart?: Chart;
  private resizeObs?: ResizeObserver;   // <<< para ajustar al cambiar tamaño
  private apiBase = 'http://localhost/programacion2/api';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // saber si sos admin
    this.auth.me(true).subscribe(m => this.isAdmin = (m.rol === 'admin'));

    // cargar ventas
    this.api.getVentas().subscribe({
      next: (d) => {
        this.ventas = d;
        this.ventasEdit = d.map(r => ({...r})); // copia para editar
        this.loading = false;
        this.renderChart();
      },
      error: () => { this.error = 'No se pudieron cargar las ventas'; this.loading = false; }
    });
  }

  ngAfterViewInit(): void {
    // pequeño delay para que el grid calcule tamaños antes del primer render
    setTimeout(() => this.renderChart(), 50);
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    this.chart?.destroy();
  }

  // Totales por fila
  totalFila(v: Venta): number {
    return this.cols.reduce((acc, c) => acc + +((v as any)[c.prop] ?? 0), 0);
  }

  // ---- Edición ----
  toggleEdit(): void {
    if (!this.isAdmin) return;
    if (this.editMode) {
      this.ventasEdit = this.ventas.map(r => ({...r}));
    }
    this.editMode = !this.editMode;
    this.renderChart();
  }

  // Guardado en SERIE
  async guardar(): Promise<void> {
    if (!this.isAdmin) return;

    try {
      for (let i = 0; i < this.ventasEdit.length; i++) {
        const row = this.ventasEdit[i];
        const payload = {
          nro: i + 1, // 1..12
          Suc1: Number(row.Suc1) || 0,
          Suc2: Number(row.Suc2) || 0,
          Suc3: Number(row.Suc3) || 0,
          Suc4: Number(row.Suc4) || 0,
          Suc5: Number(row.Suc5) || 0,
        };
        await firstValueFrom(
          this.http.post(`${this.apiBase}/Update_Ventas.php`, payload, { withCredentials: true })
        );
      }
      this.ventas = this.ventasEdit.map(r => ({ ...r }));
      this.editMode = false;
      this.renderChart();
    } catch {
      this.error = 'No se pudieron guardar los cambios';
    }
  }

  // ---- Chart.js ----
  setIsLine(val: boolean): void {
    this.isLine = val;
    this.renderChart();
  }

  setChartType(type: 'line' | 'bar') {
    this.isLine = (type === 'line');
    setTimeout(() => this.renderChart(), 0); // asegura que el canvas ya esté en el DOM
  }

  private renderChart(): void {
    if (!this.showChart) { this.chart?.destroy(); return; }

    const canvas = document.getElementById('ventasChart') as HTMLCanvasElement | null;
    if (!canvas || !this.ventasEdit?.length) return;

    // 1) Tomar tamaño real del contenedor (tarjeta) y setearlo en el canvas
    const card = canvas.parentElement as HTMLElement;
    const r = card?.getBoundingClientRect();
    if (r && r.width > 0 && r.height > 0) {
      canvas.width  = Math.floor(r.width);
      canvas.height = Math.floor(r.height);
    }

    const labels = this.mes.slice();
    const dataFor = (prop: string) => this.ventasEdit.map(r => Number((r as any)[prop] || 0));

    const type = this.isLine ? 'line' : 'bar';
    const data = {
      labels,
      datasets: [
        { label: 'Santa Fe',   data: dataFor('Suc1') },
        { label: 'Paraná',     data: dataFor('Suc2') },
        { label: 'Santo Tomé', data: dataFor('Suc3') },
        { label: 'Rafaela',    data: dataFor('Suc4') },
        { label: 'Rosario',    data: dataFor('Suc5') },
      ]
    };

    const cfg: ChartConfiguration = {
      type: type as any,
      data,
      options: { responsive: true, maintainAspectRatio: false }
    };

    // 2) Crear el chart tras un frame (layout listo), y ajustar
    requestAnimationFrame(() => {
      this.chart?.destroy();
      this.chart = new Chart(canvas, cfg);
      this.chart.update();
      this.chart.resize();
    });

    // 3) Observar cambios de tamaño del contenedor para re-ajustar
    if (!this.resizeObs && card) {
      this.resizeObs = new ResizeObserver(() => { this.chart?.resize(); });
      this.resizeObs.observe(card);
    }
  }
}