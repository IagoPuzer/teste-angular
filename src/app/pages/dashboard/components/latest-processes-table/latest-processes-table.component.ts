import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LegalProcess } from '../../../../models/process.model';

@Component({
  selector: 'app-latest-processes-table',
  standalone: true,
  imports: [CardModule, TableModule, TagModule],
  templateUrl: './latest-processes-table.component.html'
})
export class LatestProcessesTableComponent {
  @Input({ required: true }) latest: LegalProcess[] = [];

  tagStyle(status: string): Record<string, string> {
    if (status === 'ATIVO') {
      return { background: '#166534', color: '#dcfce7', border: '1px solid #15803d' };
    }
    if (status === 'FINALIZADO') {
      return { background: '#1e3a8a', color: '#dbeafe', border: '1px solid #2563eb' };
    }
    return { background: '#9a3412', color: '#ffedd5', border: '1px solid #c2410c' };
  }
}
