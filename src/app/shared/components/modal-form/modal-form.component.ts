import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent {
  @Input() title = 'Formulario';
  @Input() isEdit = false;
  @Input() visible = false;
  @Input() form!: FormGroup;
  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onEnter(event: Event) { 
  const tag = (event.target as HTMLElement).tagName.toLowerCase();
  if (tag !== 'textarea') {
    this.submitted.emit();
  }
}
}
