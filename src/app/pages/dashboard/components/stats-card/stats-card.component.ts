import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './stats-card.component.html'
})
export class StatsCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = 0;
  @Input() valueClass = 'text-slate-900';
}
