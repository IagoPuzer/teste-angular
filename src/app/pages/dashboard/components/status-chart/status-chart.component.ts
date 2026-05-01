import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CardModule, ChartModule],
  templateUrl: './status-chart.component.html'
})
export class StatusChartComponent {
  @Input({ required: true }) chartData!: object;
  @Input({ required: true }) chartOptions!: object;
}
