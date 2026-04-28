import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { LegalProcess, ProcessFilters, ProcessStatus } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { ProcessListComponent } from './components/process-list/process-list.component';

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
    ConfirmDialogModule,
    ButtonModule,
    ProcessFormComponent,
    ProcessListComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './processes.page.html'
})
export class ProcessesPage implements OnInit {
  private readonly processService = inject(ProcessService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Finalizado', value: 'FINALIZADO' },
    { label: 'Suspenso', value: 'SUSPENSO' }
  ];

  readonly items = signal<LegalProcess[]>([]);
  readonly total = signal(0);
  readonly first = signal(0);
  readonly rows = signal(5);
  readonly page = signal(1);
  readonly showForm = signal(false);
  readonly editing = signal<LegalProcess | undefined>(undefined);

  readonly filters: ProcessFilters = {
    client: '',
    status: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 5
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
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Processo salvo com sucesso.' });
      this.load();
    });
  }

  remove(process: LegalProcess): void {
    this.confirmationService.confirm({
      message: `Deseja excluir o processo ${process.processNumber}?`,
      header: 'Confirmar exclusao',
      accept: () => {
        this.processService.remove(process.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Excluido', detail: 'Processo removido.' });
          this.load();
        });
      }
    });
  }

  updateSort(sortBy: keyof LegalProcess): void {
    const nextDirection = this.filters.sortBy === sortBy && this.filters.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filters.sortBy = sortBy;
    this.filters.sortDirection = nextDirection;
    this.load();
  }

  setStatus(value: string): void {
    this.filters.status = value as ProcessStatus | '';
    this.applyFilters();
  }
}
