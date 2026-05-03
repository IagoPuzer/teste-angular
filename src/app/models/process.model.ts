export type ProcessStatus = 'ATIVO' | 'FINALIZADO' | 'SUSPENSO';

export interface LegalProcess {
  id: string;
  processNumber: string;
  client: string;
  description: string;
  status: ProcessStatus;
  createdAt: string;
}

export interface ProcessFilters {
  client?: string;
  status?: ProcessStatus | '';
  page?: number;
  pageSize?: number;
}

export interface PaginatedProcesses {
  data: LegalProcess[];
  total: number;
  page: number;
  pageSize: number;
}
