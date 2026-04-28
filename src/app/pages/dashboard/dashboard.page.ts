import { Component, OnInit, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LegalProcess } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CardModule, ChartModule, TableModule, TagModule],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  private readonly processService = inject(ProcessService);
  readonly total = signal(0);
  readonly latest = signal<LegalProcess[]>([]);
  readonly chartData = signal({
    labels: ['Ativo', 'Finalizado', 'Suspenso'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#22c55e', '#6366f1', '#f59e0b'] }]
  });

  ngOnInit(): void {
    this.processService.getAll().subscribe((items) => {
      this.total.set(items.length);
      this.latest.set(items.slice(0, 5));
      const stats = this.processService.statsByStatus(items);
      this.chartData.set({
        labels: ['Ativo', 'Finalizado', 'Suspenso'],
        datasets: [{ data: [stats.ATIVO, stats.FINALIZADO, stats.SUSPENSO], backgroundColor: ['#22c55e', '#6366f1', '#f59e0b'] }]
      });
    });
  }
}
