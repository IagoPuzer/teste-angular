import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './delete-confirm-dialog.component.html'
})
export class DeleteConfirmDialogComponent {
  @Input({ required: true }) visible = false;
  @Input() processNumber = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();

  close(): void {
    this.visibleChange.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
