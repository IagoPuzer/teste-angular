import { Component, OnInit, inject, signal } from '@angular/core';
import { LegalProcess } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { StatusChartComponent } from './components/status-chart/status-chart.component';
import { LatestProcessesTableComponent } from './components/latest-processes-table/latest-processes-table.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [StatsCardComponent, StatusChartComponent, LatestProcessesTableComponent],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  private readonly processService = inject(ProcessService);
  readonly total = signal(0);
  readonly latest = signal<LegalProcess[]>([]);
  readonly statusStats = signal({ ATIVO: 0, FINALIZADO: 0, SUSPENSO: 0 });
  readonly chartOptions = signal({
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#334155',
          boxWidth: 14,
          boxHeight: 14
        }
      }
    }
  });
  readonly chartData = signal({
    labels: ['Ativo', 'Finalizado', 'Suspenso'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#22c55e', '#6366f1', '#f59e0b'],
        borderWidth: 0
      }
    ]
  });

  ngOnInit(): void {
    this.processService.getAll().subscribe((items) => {
      this.total.set(items.length);
      this.latest.set(items.slice(0, 5));
      const stats = this.processService.statsByStatus(items);
      this.statusStats.set(stats);
      this.chartData.set({
        labels: ['Ativo', 'Finalizado', 'Suspenso'],
        datasets: [
          {
            data: [stats.ATIVO, stats.FINALIZADO, stats.SUSPENSO],
            backgroundColor: ['#22c55e', '#6366f1', '#f59e0b'],
            borderWidth: 0
          }
        ]
      });
    });
  }
}
