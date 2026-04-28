import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessFormComponent } from './process-form.component';

describe('ProcessFormComponent', () => {
  let component: ProcessFormComponent;
  let fixture: ComponentFixture<ProcessFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve invalidar formulario vazio', () => {
    component.form.patchValue({
      processNumber: '',
      client: '',
      description: '',
      status: 'ATIVO',
      createdAt: ''
    });
    expect(component.form.invalid).toBeTrue();
  });
});
