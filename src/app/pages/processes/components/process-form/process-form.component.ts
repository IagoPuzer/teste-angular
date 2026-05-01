import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { LegalProcess, ProcessStatus } from '../../../../models/process.model';

@Component({
  selector: 'app-process-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule, SelectModule, ButtonModule],
  templateUrl: './process-form.component.html'
})
export class ProcessFormComponent implements OnChanges {
  @Input() process?: LegalProcess;
  @Output() save = new EventEmitter<Omit<LegalProcess, 'id'>>();

  private readonly fb = inject(FormBuilder);
  readonly statusOptions = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Finalizado', value: 'FINALIZADO' },
    { label: 'Suspenso', value: 'SUSPENSO' }
  ];

  readonly form = this.fb.nonNullable.group({
    processNumber: ['', [Validators.required]],
    client: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(6)]],
    status: ['ATIVO' as ProcessStatus, [Validators.required]],
    createdAt: ['', [Validators.required]]
  });

  ngOnChanges(): void {
    if (!this.process) {
      this.form.reset({
        processNumber: '',
        client: '',
        description: '',
        status: 'ATIVO',
        createdAt: ''
      });
      return;
    }
    this.form.patchValue(this.process);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
  }
}
