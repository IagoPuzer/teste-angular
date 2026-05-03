import { Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LegalProcess,
  PaginatedProcesses,
  ProcessFilters,
  ProcessStatus,
} from '../models/process.model';

const MOCK_DATA: LegalProcess[] = [
  {
    id: '1',
    processNumber: '1000012-53.2025.8.26.0100',
    client: 'Empresa Atlas',
    description: 'Acao de cobranca contratual',
    status: 'ATIVO',
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    processNumber: '1002441-18.2025.8.26.0100',
    client: 'Joao Pereira',
    description: 'Reclamacao trabalhista',
    status: 'SUSPENSO',
    createdAt: '2026-03-14',
  },
  {
    id: '3',
    processNumber: '1005321-94.2025.8.26.0100',
    client: 'Maria Silva',
    description: 'Revisao de contrato de locacao',
    status: 'FINALIZADO',
    createdAt: '2026-03-18',
  },
  {
    id: '4',
    processNumber: '1007880-21.2025.8.26.0100',
    client: 'Fundacao Horizonte',
    description: 'Execucao fiscal municipal',
    status: 'ATIVO',
    createdAt: '2026-03-22',
  },
  {
    id: '5',
    processNumber: '1009001-77.2025.8.26.0100',
    client: 'Carlos Mendes',
    description: 'Indenizacao por danos morais',
    status: 'ATIVO',
    createdAt: '2026-03-25',
  },
  {
    id: '6',
    processNumber: '1010442-83.2025.8.26.0100',
    client: 'Construtora Vale',
    description: 'Impugnacao de multa administrativa',
    status: 'SUSPENSO',
    createdAt: '2026-04-01',
  },
];

@Injectable({ providedIn: 'root' })
export class ProcessService {
  private readonly processes = signal<LegalProcess[]>(MOCK_DATA);

  getAll(): Observable<LegalProcess[]> {
    return of(this.sortedByDate(this.processes())).pipe(
      delay(environment.apiDelayMs),
    );
  }

  getPaginated(filters: ProcessFilters): Observable<PaginatedProcesses> {
    let result = [...this.processes()];

    if (filters.client?.trim()) {
      const search = filters.client.toLowerCase();
      result = result.filter((item) =>
        item.client.toLowerCase().includes(search),
      );
    }

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 5;
    const start = (page - 1) * pageSize;
    const data = result.slice(start, start + pageSize);

    return of({ data, total: result.length, page, pageSize }).pipe(
      delay(environment.apiDelayMs),
    );
  }

  getById(id: string): Observable<LegalProcess | undefined> {
    return of(this.processes().find((item) => item.id === id)).pipe(
      delay(environment.apiDelayMs),
    );
  }

  create(payload: Omit<LegalProcess, 'id'>): Observable<LegalProcess> {
    const created: LegalProcess = { ...payload, id: crypto.randomUUID() };
    this.processes.update((current) => [created, ...current]);
    return of(created).pipe(delay(environment.apiDelayMs));
  }

  update(
    id: string,
    payload: Omit<LegalProcess, 'id'>,
  ): Observable<LegalProcess | undefined> {
    let updatedValue: LegalProcess | undefined;
    this.processes.update((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        updatedValue = { ...payload, id };
        return updatedValue;
      }),
    );
    return of(updatedValue).pipe(delay(environment.apiDelayMs));
  }

  remove(id: string): Observable<void> {
    this.processes.update((current) =>
      current.filter((item) => item.id !== id),
    );
    return of(void 0).pipe(delay(environment.apiDelayMs));
  }

  statsByStatus(items: LegalProcess[]): Record<ProcessStatus, number> {
    return items.reduce(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      { ATIVO: 0, FINALIZADO: 0, SUSPENSO: 0 },
    );
  }

  private sortedByDate(items: LegalProcess[]): LegalProcess[] {
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
