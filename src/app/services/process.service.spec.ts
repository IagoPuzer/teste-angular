import { TestBed } from '@angular/core/testing';
import { ProcessService } from './process.service';

describe('ProcessService', () => {
  let service: ProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessService);
  });

  it('deve listar processos paginados', (done) => {
    service.getPaginated({ page: 1, pageSize: 5 }).subscribe((result) => {
      expect(result.data.length).toBeLessThanOrEqual(5);
      expect(result.total).toBeGreaterThan(0);
      done();
    });
  });

  it('deve criar um processo', (done) => {
    service
      .create({
        processNumber: '1099999-88.2026.8.26.0100',
        client: 'Cliente Teste',
        description: 'Descricao teste',
        status: 'ATIVO',
        createdAt: '2026-04-28'
      })
      .subscribe((created) => {
        expect(created.id).toBeTruthy();
        done();
      });
  });
});
