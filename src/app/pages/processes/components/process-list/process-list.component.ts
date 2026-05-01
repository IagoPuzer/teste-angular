import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LegalProcess } from '../../../../models/process.model';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [CardModule, TableModule, ButtonModule, TagModule],
  templateUrl: './process-list.component.html'
})
export class ProcessListComponent {
  @Input() processes: LegalProcess[] = [];
  @Input() total = 0;
  @Input() rows = 5;
  @Input() first = 0;
  @Output() pageChange = new EventEmitter<{ page: number; rows: number }>();
  @Output() edit = new EventEmitter<LegalProcess>();
  @Output() remove = new EventEmitter<LegalProcess>();

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
