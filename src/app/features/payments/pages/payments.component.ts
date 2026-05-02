import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Payment } from '../../../core/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  private svc = inject(PaymentService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  items = signal<Payment[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'id_payment', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'type', label: 'Tipo' },
  ];

  form = this.fb.group({
    id_payment: [null as number | null],
    name: ['', Validators.required],
    type: ['', Validators.required],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => { this.items.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar métodos de pago', 'error'); }
    });
  }

  openAdd() { this.isEdit.set(false); this.form.reset(); this.modalVisible.set(true); }
  openEdit(row: Payment) { this.isEdit.set(true); this.form.patchValue(row); this.modalVisible.set(true); }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos', 'error'); return; }
    const val = this.form.value as any;
    const action = this.isEdit() ? this.svc.update(val) : this.svc.create(val);
    action.subscribe({
      next: () => { this.notif.show('Método guardado', 'success'); this.modalVisible.set(false); this.load(); },
      error: () => this.notif.show('Error al guardar', 'error')
    });
  }

  delete(row: Payment) {
    this.svc.delete(row.id_payment).subscribe({
      next: () => { this.notif.show('Método eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}
