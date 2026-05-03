import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  LegalProcess,
  ProcessFilters,
  ProcessStatus,
} from '../../models/process.model';
import { ProcessService } from '../../services/process.service';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { ProcessListComponent } from './components/process-list/process-list.component';
import { DeleteConfirmDialogComponent } from './components/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-processes-page',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    ButtonModule,
    ProcessFormComponent,
    ProcessListComponent,
    DeleteConfirmDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './processes.page.html',
})
export class ProcessesPage implements OnInit {
  private readonly processService = inject(ProcessService);
  private readonly messageService = inject(MessageService);

  readonly statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Finalizado', value: 'FINALIZADO' },
    { label: 'Suspenso', value: 'SUSPENSO' },
  ];

  readonly items = signal<LegalProcess[]>([]);
  readonly total = signal(0);
  readonly first = signal(0);
  readonly rows = signal(5);
  readonly page = signal(1);
  readonly showForm = signal(false);
  readonly editing = signal<LegalProcess | undefined>(undefined);
  readonly showDeleteConfirm = signal(false);
  readonly deleting = signal<LegalProcess | undefined>(undefined);

  readonly filters: ProcessFilters = {
    client: '',
    status: '',
    page: 1,
    pageSize: 5,
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.processService.getPaginated(this.filters).subscribe((result) => {
      this.items.set(result.data);
      this.total.set(result.total);
      this.rows.set(result.pageSize);
      this.page.set(result.page);
      this.first.set((result.page - 1) * result.pageSize);
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.load();
  }

  onPageChange(event: { page: number; rows: number }): void {
    this.filters.page = event.page + 1;
    this.filters.pageSize = event.rows;
    this.load();
  }

  openCreate(): void {
    this.editing.set(undefined);
    this.showForm.set(true);
  }

  openEdit(process: LegalProcess): void {
    this.editing.set(process);
    this.showForm.set(true);
  }

  save(payload: Omit<LegalProcess, 'id'>): void {
    const action = this.editing()
      ? this.processService.update(this.editing()!.id, payload)
      : this.processService.create(payload);

    action.subscribe(() => {
      this.showForm.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Processo salvo com sucesso.',
      });
      this.load();
    });
  }

  onFormVisibilityChange(visible: boolean): void {
    this.showForm.set(visible);
    if (!visible) {
      this.editing.set(undefined);
    }
  }

  remove(process: LegalProcess): void {
    this.deleting.set(process);
    this.showDeleteConfirm.set(true);
  }

  onDeleteDialogVisibilityChange(visible: boolean): void {
    this.showDeleteConfirm.set(visible);
    if (!visible) {
      this.deleting.set(undefined);
    }
  }

  confirmDelete(): void {
    const process = this.deleting();
    if (!process) {
      return;
    }
    this.processService.remove(process.id).subscribe(() => {
      this.showDeleteConfirm.set(false);
      this.deleting.set(undefined);
      this.messageService.add({
        severity: 'success',
        summary: 'Excluido',
        detail: 'Processo removido.',
      });
      this.load();
    });
  }

  setStatus(value: string): void {
    this.filters.status = value as ProcessStatus | '';
    this.applyFilters();
  }
}
