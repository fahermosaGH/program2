import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Cliente } from '../services/api.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getClientes().subscribe({
      next: (data) => { this.clientes = data; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar clientes'; this.loading = false; }
    });
  }
}