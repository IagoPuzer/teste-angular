import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LegalProcess } from '../../../../models/process.model';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule],
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
}
